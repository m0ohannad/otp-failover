# Wamda - OTP Failover Service

![Wamda Logo](https://github.com/user-attachments/assets/1d177b58-2926-4a60-a1a6-9c717b12807a)

## Description

Wamda is an OTP failover service designed to provide a seamless and reliable user authentication process by sending OTP (One-Time Password) codes to users. The service automatically switches between different OTP providers to ensure successful delivery of OTP messages, even if one provider fails.

This project simulates switching between communication networks in case one fails to send SMS messages. As a prototype, OTP service providers were used instead of communication network providers due to additional requirements such as having a commercial registration.

## Technologies Used

- [NestJS](https://nestjs.com) - A progressive Node.js framework for building efficient and scalable server-side applications.
- [TypeORM](https://typeorm.io) - An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- [PostgreSQL](https://www.postgresql.org) - A powerful, open-source object-relational database system.
- [Winston](https://github.com/winstonjs/winston) - A versatile logging library for Node.js.
- [Twilio](https://www.twilio.com) - A cloud communications platform for building SMS, voice, and messaging applications.

## Project Setup

```bash
$ npm install
```

##  Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints Documentation

### Send OTP

#### Endpoint: `POST /otp/send`

#### Request Body

```json
{
  "phoneNumber": "+9611234567"
}
```

#### Response

- 200 OK

```html
OTP sent successfully via VendorA (Test Mode)
```

- 500 Internal Server Error

```json
{
    "status": 500,
    "error": "Failed to send OTP via all vendors"
}
```

### Verify OTP

#### Endpoint: `POST /otp/verify`

#### Request Body

```json
{
  "phoneNumber": "+9611234567",
  "otp": "1234"
}
```

#### Response

- valid OTP

```html
true
```

- invalid OTP

```html
false
```

## Log Example

### Example 1 Successful OTP Sending via VendorA

![First-Case](https://github.com/user-attachments/assets/9c06af20-7cfb-44e6-98aa-c83757bd9782)

### Example 2: Switch Vendor when failed send OTP:

![Second-Case](https://github.com/user-attachments/assets/bd0df03b-c630-42f4-8d7a-4a81f5df097f)

## Acknowledgements

This project was built by Team 6 during the second phase of the [Masar](https://x.com/devWithSANI) By [SANI](https://masarbysani.com) competition, in the stage of building a real product.