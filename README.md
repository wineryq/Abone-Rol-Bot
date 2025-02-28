# Türkçe Discord Abone Rol Botu Winery Tarafından Yapıldı.

Bu Discord botu, sunucunuzda abone rol yönetimi ve fotoğraf kanalı kontrolü sağlar.
Botu satmak yasaktır. Satıldığı zaman MIT tarafından işlem uygulanır.

## Özellikler

- **Abone Rol Sistemi**: Fotoğraf onaylandığında kullanıcıya otomatik rol verilir
- **Fotoğraf Kanalı Kontrolü**: Belirtilen kanala sadece fotoğraf yüklenebilir
- **Bildirim Sistemi**: Rol verildiğinde hem kanalda hem de DM üzerinden bildirim gönderilir

## Kurulum

1. Repoyu klonlayın
2. `npm install` komutunu çalıştırarak bağımlılıkları yükleyin
3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli bilgileri doldurun:
   - `TOKEN`: Discord bot token'ınız
   - `SUBSCRIBER_ROLE_ID`: Abone rolünün ID'si
   - `PHOTO_CHANNEL_ID`: Fotoğraf kanalının ID'si
4. `npm start` komutu ile botu başlatın

## Komutlar

- `!yardım`: Komut listesini gösterir
- `!abone`: Abone rol sistemini açıklar
- `!bilgi`: Bot hakkında bilgi verir

## Nasıl Çalışır?

1. Kullanıcı belirlenen kanala bir fotoğraf yükler
2. Bot otomatik olarak fotoğrafa ✅ emojisi ekler
3. Yetkili kişi ✅ emojisine tıkladığında kullanıcıya abone rolü verilir
4. Kullanıcı hem kanalda hem de DM üzerinden bilgilendirilir

## Gereksinimler

- Node.js v16.9.0 veya daha yüksek
- Discord.js v14