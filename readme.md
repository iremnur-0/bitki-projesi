# Bitki Takip ve Bilgi Paylaşım Uygulaması 🌱

Bu React Native uygulaması, bitki severler için bir platform sunar. Kullanıcılar, **uzman** ya da **meraklı (enthusiast)** olarak giriş yapabilir, bitkilerini takip edebilir, bitki ekleyebilir, forumda bilgi paylaşabilir ve daha fazlasını yapabilir.

## Geliştirici

- Software Engineering dersi için Grup Projesi olarak geliştirildi.

## Özellikler

- Kullanıcı tipi seçimi (Uzman / Meraklı)
- Bitki ekleme ve arama
- Kategoriye göre bitki listeleme (Sebzeler, Meyveler, Çiçekler)
- Forum özelliği (bilgi alışverişi)
- Bitki gelişim takibi
- Kayıt / Giriş ekranları (uzman ve meraklılar için ayrı)
- Context API ile global state yönetimi

## Navigasyon Yapısı

- `WelcomeScreen`: Açılış ekranı
- `HomeScreen`: Uzman/Meraklı seçimi
- `ExpertSignInScreen` / `ExpertSignUpScreen`: Uzman kullanıcılar için giriş/kayıt
- `EnthusiastSignInScreen` / `EnthusiastSignUpScreen`: Meraklı kullanıcılar için giriş/kayıt
- `ExpertHomeScreen` / `EnthusiastHomeScreen`: Kullanıcı ana sayfaları
- `SearchAndAddPage`: Bitki arama ve ekleme
- `TabVegetables`, `TabFruits`, `TabFlowers`: Bitkileri kategoriye göre listeleme
- `PlantScreen`: Bitki detayları
- `TrackingPage`: Bitki gelişim takibi
- `Forum`: Forum ekranı
- `MainPage`: Tabbar navigasyonlu ana sayfa

## Kurulum

1. Bu repoyu klonla:

   ```bash
   git clone https://github.com/kullaniciadi/bitki-app.git
   cd bitki-app
