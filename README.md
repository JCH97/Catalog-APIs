Prueba Técnica – APIs de Productos (DDD)

Este proyecto implementa un catálogo de productos siguiendo principios de Diseño Orientado al Dominio (Domain‑Driven Design). La solución está compuesta por dos microservicios:
- api-main – API GraphQL central para creación, gestión y consulta de productos y sus historiales. Está escrita en TypeScript, expone un endpoint GraphQL y persiste datos en MongoDB. Además publica eventos de dominio mediante Redis.
- api-search – Servicio REST de búsqueda de productos. Consume los eventos del bus para indexar los productos en Elasticsearch y ofrece un endpoint HTTP para consultas.

A continuación se describen la arquitectura, tecnologías y componentes de cada capa.

Arquitectura de Capas

El código se organiza en cuatro capas claramente separadas que siguen el patrón de Clean Architecture:
1. Domain
   - Contiene las entidades de negocio (Product, AuditEntry), los enumerados (Role, ProductStatus, AuditAction) y las interfaces de repositorio. 
   - Las entidades son ricas: encapsulan validaciones y comportamientos. Por ejemplo, Product.create() valida el GTIN, nombre y peso, y asigna estado inicial según el rol del actor; Product.updateDetails() aplica updates de forma controlada; Product.approve() verifica permisos. 
   - Los constructores de las entidades son privados; la única manera de obtener instancias es a través de métodos estáticos (create, hydrate).
2. Application
    - Define casos de uso (CreateProductUseCase, UpdateProductUseCase, etc.) y DTOs de entrada/salida. 
    - Cada caso de uso recibe los repositorios que necesita, orquesta las entidades del dominio, registra auditorías y emite eventos. 
    - Devuelven un objeto Result<T> que encapsula éxito o error con los respectivos mensajes (AppError). 
    - No depende de Express ni de Mongoose; sólo conoce las interfaces del dominio.
3. Infra: Implementa los detalles tecnológicos
    - Persistence: conexión a MongoDB y definición de modelos Mongoose (mongodb.ts, mongooseModels.ts). 
    - Repositories: implementaciones concretas (product.mongo.repository.ts, audit.mongo.repository.ts) que cumplen las interfaces del dominio. 
    - Mappers: transforman entre documentos de persistencia y entidades, y entre entidades y DTOs para presentación. 
    - Messaging: conexión a Redis (messageBus.ts) para publicar y suscribir eventos de dominio. 
    - Loaders: fabrican instancias de DataLoader (de la librería oficial dataloader) para resolver consultas N+1 en GraphQL, como auditByProductId y productById. 
    - Auth: middleware JWT y helpers para descodificar el rol del usuario.
4. Presentation 
    - Contiene los puntos de entrada que interactúan con el cliente.
    - GraphQL (src/presentation/graphql): define el esquema, los resolvers y el servidor Apollo. Las queries y mutaciones delegan en casos de uso y utilizan DataLoaders para optimizar accesos a MongoDB. 
    - REST (en api-search): se implementa con Express y expone un endpoint /search que acepta parámetro q y devuelve productos coincidentes. 
    - Los resolvers nunca instancian directamente entidades o consultan la base de datos; usan los casos de uso y mapean las entidades a DTOs.

Tecnologías Utilizadas: 
- Node.js con TypeScript para api-main, y JavaScript moderno para api-search.
- Express.js como servidor HTTP.
- GraphQL con Apollo Server para la API principal.
- MongoDB con Mongoose para la persistencia de productos y auditorías.
- Elasticsearch para indexar y buscar productos en el servicio de búsqueda.
- Redis como bus de mensajes; implementa el patrón de eventos de dominio (product.created, product.updated, product.approved).
- DataLoader (paquete oficial de npm) para agrupar y cachear consultas en GraphQL, evitando el problema N+1.
- Docker Compose para orquestar los servicios y dependencias.
- Librería Result, Optional y AppError en src/shared para manejo funcional de errores y valores opcionales.
- Jest para test unitarios

api-main (GraphQL)
- Dominio: implementa Product con campos como id, gtin, name, description, brand, manufacturer, netWeight, status, createdByRole, createdAt, updatedAt, version. También define AuditEntry para registrar los cambios (acción, campos modificados, quién y cuándo).
- Caso de uso “CreateProduct”: valida la entrada, crea la entidad Product, guarda en MongoDB, graba una AuditEntry inicial y publica un evento de dominio.
- Caso de uso “UpdateProduct”: recupera el producto, aplica parches autorizados según el rol, incrementa la versión, registra las diferencias en auditoría y emite evento.
- Caso de uso “ApproveProduct”: cambia el estado a PUBLISHED si el actor es EDITOR, registra la auditoría y emite evento.
- GraphQL Schema: define tipos, enums, queries (product, products) y mutaciones (createProduct, updateProduct, approveProduct). Incluye un campo history en Product que resuelve un listado de AuditEntry utilizando un DataLoader por productId, evitando consultas repetitivas .
- Autenticación y roles: se usa JWT en el middleware; los resolvers extraen el rol (PROVIDER, EDITOR) del token para aplicar las reglas de negocio (por ejemplo, un proveedor crea en estado PENDING_REVIEW, un editor puede aprobar).

api-search (REST)
- Dominio: sólo requiere Product con los campos que se indexan.
- Caso de uso “SearchProducts”: recibe un query string q, consulta el índice Elasticsearch y devuelve los productos coincidentes.
- Caso de uso “IndexProduct”: maneja eventos desde Redis; transforma el producto a un documento de búsqueda e indexa/actualiza en Elasticsearch.
- Infra: incluye elastic.js para configurar la conexión al clúster; repositorio product.search.repository.js con métodos index y search.
- Messaging: redisSubscriber.js se suscribe a los eventos y ejecuta el caso de uso indexProduct para mantener el índice actualizado.
- Presentación: server.js monta un endpoint /search?q= que invoca search-products.usecase.js y devuelve los resultados en JSON.

Postman:
- En la raíz del proyecto contamos además con una colección de postman que contiene todos los elementos necesarios para hacer las pruebs sobre los requerimientos del proyecto.
- Esta colección está preparada para trabajar con ambas APIs y maneja la autenticación JWT de forma automática mediante scripts de Postman, por tanto SignInAsEditor y SignInAsProvider fijan en jwt lo necesario para proceder con las operaciones sobre los productos.
- Se usaron además las variables dinámicas de postman para crear datos falsos y que crear/editar productos requiera la menor intervención manual.

Instrucciones para ejecución (vía docker compose):
1. Clonar el repositorio y situarse en la raíz.
2. Ejecutar el comando:
    ```docker compose up -d```

Instrucciones para ejecución manual:
1. En la raíz de cada una de las apis, tener un archivo .env que contenga las mismas variables que .env.exmaple
2. Tener instancias de redis, elastic y mongodb ejecutandose en localhost por los puertos regulares de cada uno de los servicios, además de tener node y npm instalados.
3. Ejecutar ```npm i``` para cada una de las apis.
4. Ejecutar ```npm run dev```(modo desarrollo) en cada una de las apis, primero en api-search y luego en api-main.
###### El motivo de seguir este orden es debido a que api-main cuando se ejeucta automáticame incluye datos para pruebas en BD y por tanto lanza eventos a api-search, es decir que api-search previamente debe estar up para poder procesar estos eventos.

