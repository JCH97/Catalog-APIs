import 'dotenv/config';
import {connectMongo} from '../infra/persistence/mongodb.js';
import {AuditModel, ProductModel} from '../infra/persistence/mongoose.models.js';
import {createRedisPublisher} from '../infra/messaging/message-bus.js';
import {ProductRepository} from '../infra/repositories/product.repository.js';
import {auditRepository} from '../infra/repositories/audit.repository.js';
import {CreateProductUseCase} from '../application/use-cases/create-product.usecase.js';
import {Role} from '../domain/enums/role.js';

export async function runSeed() {
    await connectMongo();
    await ProductModel.deleteMany({});
    await AuditModel.deleteMany({});
    const publisher = await createRedisPublisher(process.env.REDIS_URL || 'redis://localhost:6379');
    const productRepo = ProductRepository();
    const auditRepo = auditRepository();
    const createUC = new CreateProductUseCase(productRepo, auditRepo, publisher);
    {
        const res1 = await createUC.execute({
            gtin: '12345678901231',
            name: 'Smartphone 6.1" 128GB',
            description: '6.1" OLED 120Hz display with ultra-thin bezels. 128GB UFS 3.1 storage and 6GB RAM for smooth multitasking. Dual rear cameras (50MP main with OIS + 12MP ultrawide) and 12MP front camera with night mode. 5G, Wi‑Fi 6E, Bluetooth 5.3, NFC, dual‑SIM. 4500 mAh battery with 30W USB‑C fast charging. Side fingerprint reader and face unlock. Ships with Android 14 and 3 years of security updates.',
            brand: 'NovaTech',
            manufacturer: 'NovaTech Mobile Inc.',
            netWeight: {value: 180, unit: 'GRAM'}
        }, Role.PROVIDER);
        res1.unwrap();
    }
    {
        const res2 = await createUC.execute({
            gtin: '12345678901232',
            name: 'Laptop 14" 16GB/512GB',
            description: '14" IPS 2.2K anti‑glare display in a 1.3 kg magnesium‑alloy chassis. Latest‑generation 10‑core mobile processor, 16GB LPDDR5 memory and 512GB NVMe SSD. Backlit keyboard, precision glass trackpad and 1080p webcam with privacy shutter. Ports: 2x USB‑C (Thunderbolt 4), USB‑A, HDMI 2.0, audio combo. Wi‑Fi 6 and Bluetooth 5.2. 56Wh battery for up to 12 hours of mixed use. Fingerprint reader with Windows Hello.',
            brand: 'ByteForge',
            manufacturer: 'ByteForge Computers LLC',
            netWeight: {value: 1.3, unit: 'KILOGRAM'}
        }, Role.EDITOR);
        res2.unwrap();
    }
    {
        const res3 = await createUC.execute({
            gtin: '12345678901233',
            name: 'Wireless Headphones ANC',
            description: 'Over‑ear headphones with hybrid active noise cancelling (up to 40 dB). 40mm dynamic drivers tuned for balanced sound with deep bass and clear mids. Up to 35 hours of playback with ANC on; 5‑minute charge gives 4 hours via USB‑C. Multipoint Bluetooth 5.2 with AAC/aptX codecs, foldable design, memory‑foam cushions and beamforming mics for clear calls.',
            brand: 'SoundWave',
            manufacturer: 'SoundWave Audio Corp.',
            netWeight: {value: 250, unit: 'GRAM'}
        }, Role.PROVIDER);
        res3.unwrap();
    }
    {
        const res4 = await createUC.execute({
            gtin: '12345678901234',
            name: '27" 4K Monitor',
            description: '27" 3840×2160 IPS panel with HDR10 support and factory calibration (99% sRGB). 60Hz refresh, 5ms response and anti‑glare coating for crisp text. Connectivity: DisplayPort 1.4, 2× HDMI 2.0 and USB hub. Height‑adjustable stand with tilt, swivel, pivot and VESA 100×100 mount compatibility.',
            brand: 'PixelView',
            manufacturer: 'PixelView Displays SA',
            netWeight: {value: 4, unit: 'KILOGRAM'}
        }, Role.EDITOR);
        res4.unwrap();
    }
    {
        const res5 = await createUC.execute({
            gtin: '12345678901235',
            name: 'External SSD 1TB USB-C',
            description: 'Portable NVMe SSD with USB 3.2 Gen 2 interface delivering up to 1050 MB/s read and 1000 MB/s write speeds. Anodized aluminum body with thermal pad for sustained performance. AES‑256 hardware encryption, password protection and shock resistance up to 2 meters. Includes USB‑C to C and USB‑C to A cables.',
            brand: 'FlashDrive Co.',
            manufacturer: 'FlashDrive Co.',
            netWeight: {value: 50, unit: 'GRAM'}
        }, Role.PROVIDER);
        res5.unwrap();
    }
    {
        const res6 = await createUC.execute({
            gtin: '12345678901236',
            name: 'Mechanical Keyboard TKL',
            description: 'Tenkeyless (87‑key) hot‑swappable board compatible with 3‑pin and 5‑pin switches. Double‑shot PBT keycaps, per‑key RGB lighting and south‑facing LEDs. Full NKRO/anti‑ghosting, sound‑dampening foam and plate‑mounted stabilizers. Detachable USB‑C cable and software for macros and key remapping.',
            brand: 'KeySmith',
            manufacturer: 'KeySmith Labs Ltd.',
            netWeight: {value: 800, unit: 'GRAM'}
        }, Role.EDITOR);
        res6.unwrap();
    }
    {
        const res7 = await createUC.execute({
            gtin: '12345678901237',
            name: 'Wireless Mouse',
            description: 'Ergonomic right‑hand design with 6 programmable buttons. High‑precision 16,000 DPI optical sensor with 1000 Hz polling over 2.4 GHz and low‑latency mode; Bluetooth for multi‑device pairing. PTFE feet for smooth glide, up to 70 hours per charge and USB‑C fast charging.',
            brand: 'ClickPro',
            manufacturer: 'ClickPro Devices Inc.',
            netWeight: {value: 120, unit: 'GRAM'}
        }, Role.PROVIDER);
        res7.unwrap();
    }
    {
        const res8 = await createUC.execute({
            gtin: '12345678901238',
            name: 'Wi-Fi 6 Router',
            description: 'AX3000 dual‑band (2.4/5 GHz) router with OFDMA, MU‑MIMO and beamforming for high‑density environments. WPA3 security, guest network and built‑in VPN server. 1× Gigabit WAN + 4× Gigabit LAN ports, USB 3.0 for file sharing. App‑based setup, parental controls and QoS for prioritizing gaming/streaming.',
            brand: 'NetLink',
            manufacturer: 'NetLink Networks SA',
            netWeight: {value: 400, unit: 'GRAM'}
        }, Role.EDITOR);
        res8.unwrap();
    }
    {
        const res9 = await createUC.execute({
            gtin: '12345678901239',
            name: 'Smartwatch GPS 45mm',
            description: '45mm aluminum case with AMOLED always‑on display. Multi‑band GPS/GLONASS, optical heart‑rate and SpO2 sensors, stress and sleep tracking. 5ATM water resistance and up to 7 days of typical use. Supports notifications, music control and NFC payments; compatible with iOS and Android.',
            brand: 'PulseWear',
            manufacturer: 'PulseWear Technologies',
            netWeight: {value: 60, unit: 'GRAM'}
        }, Role.PROVIDER);
        res9.unwrap();
    }
    {
        const res10 = await createUC.execute({
            gtin: '12345678901240',
            name: 'Tablet 11" 256GB',
            description: '11" 120Hz IPS display with slim bezels and quad speakers tuned for spatial audio. Octa‑core processor, 8GB RAM and 256GB storage with microSD expansion. Wi‑Fi 6, Bluetooth 5.2, 8000 mAh battery with 33W USB‑C fast charging. 13MP rear and 12MP ultra‑wide front camera for video calls. Stylus support and Android 14 with split‑screen multitasking.',
            brand: 'Tabula',
            manufacturer: 'Tabula Inc.',
            netWeight: {value: 500, unit: 'GRAM'}
        }, Role.EDITOR);
        res10.unwrap();
    }
    console.log('Seed done.');
}
