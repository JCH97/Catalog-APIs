### Documentación del Uso de IA 

Este documento detalla cómo se integraron herramientas de inteligencia artificial en el desarrollo del proyecto. La IA se utilizó para mejorar la productividad, aclarar dudas técnicas y optimizar la documentación del proyecto. En una primera instancia se compartió el contexto del proyecto (orientación) y posteriormente se fueron realizando preguntas específicas para resolver dudas puntuales.

#### Entorno de Desarrollo

- **IDE**: Se utilizó **WebStorm** de JetBrains con **GitHub Copilot** en su versión de pago, lo que permitió asistencia de código automatizada e inteligente.
- **ChatGPT Desktop**: Se empleó la versión GPT5 en desktop, permitiendo el suministro de contexto mediante archivos del proyecto para una revisión y gestión más eficiente.
- **Gemini**: Se utilizó para generar documentación y ejemplos de código en Typescript, sobre todo para la generación de los archivos tsconfig.json.

#### Usos Específicos de la IA

1. **Resolución de Dudas Técnicas**:
   - La IA fue utilizada para aclarar dudas sobre la implementación de **Elasticsearch** y los DataLoaders de **GraphQL**.
   - La IA garantizó una integración más fluida y la resolución de problemas técnicos de forma rápida.

2. **Documentación del Proyecto**:
   - ChatGPT y Gemini ayudaron a redactar tanto la documentación interna del código como el archivo **README.md**  del proyecto.

3. **Validaciones y Reglas de Negocio**:
   - La IA para agilizar las validaciones en la capa de dominio, asegurando que las reglas de negocio cumplieran con la arquitectura y los requisitos del proyecto.
   - Se empleó para generar reglas sencillas y automatizar ciertas validaciones, mejorando la eficiencia del desarrollo.


#### Ejemplos de prompts usados en el desarrollo:

   - Asume el rol de experto en graphql. Necesito me detalles casos de uso comunes de los DataLoders de graphql y su utilización con nodejs-express. Ofrece ejemplos de código para hacer la respuesta más clara
   - Asume el rol de experto en docker. Modifica este docker-compose para agregar un healtcheck a elastic y que tanto api-main como api-search esperen que ES esta healthy para iniciar.
   - Genera el archivo tsconfig.json.
   - Genera gitignore y dockerignnore en la raiz del proyecto.
   - Agrega la documentación para este archivo. [Archivo previamente cargado en el contexto]


#### Consideraciones Finales

En conjunto, estas herramientas de IA no solo facilitaron el proceso de codificación, sino que también permitieron una documentación más robusta y un cumplimiento más estricto de las reglas de negocio.
