import 'dotenv/config';
import { connectMongo } from '../infra/persistence/mongodb.js';
import { ProductModel, AuditModel } from '../infra/persistence/mongoose.models';
import { createRedisPublisher } from '../infra/messaging/message-bus';
import { ProductRepository } from '../infra/repositories/product.repository';
import { auditRepository } from '../infra/repositories/audit.repository';
import { CreateProductUseCase } from '../application/use-cases/create-product.usecase.js';
import { Role } from '../domain/enums/role';

async function run() {
  await connectMongo();
  await ProductModel.deleteMany({});
  await AuditModel.deleteMany({});
  const publisher = await createRedisPublisher(process.env.REDIS_URL || 'redis://localhost:6379');
  const productRepo = ProductRepository();
  const auditRepo = auditRepository();
  const createUC = new CreateProductUseCase(productRepo, auditRepo, publisher);
  {
    const res1 = await createUC.execute({
      gtin: '00011122233348',
      name: 'Tomato Sauce 500g',
      description: 'Natural tomato',
      brand: 'Casa Pomodoro',
      manufacturer: 'Pomodoro LLC',
      netWeight: { value: 500, unit: 'GRAM' }
    }, Role.PROVIDER);
    res1.unwrap();
  }
  {
    const res2 = await createUC.execute({
      gtin: '00011122233399',
      name: 'Olive Oil 1L',
      description: 'Extra virgin',
      brand: 'Mediterránea',
      manufacturer: 'Olivares SA',
      netWeight: { value: 1, unit: 'KILOGRAM' }
    }, Role.EDITOR);
    res2.unwrap();
  }
  console.log('Seed done.');
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });
