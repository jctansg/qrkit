# Generate SGQR JavaScript Library

A lightweight, dependency-free JavaScript library for generating the payload string for a Singapore Quick Response Code (SGQR). This library constructs a string that conforms to the EMV® QR Code Specification for Merchant-Presented Mode, which is the standard used by SGQR.

This library **only generates the payload string**. You will need a separate QR code rendering library (like [qrcode.js](https://github.com/davidshimjs/qrcodejs)) to display the actual QR code image.

## Features

-   Generate a valid SGQR payload string.
-   Supports multiple payment methods:
    -   PayNow
    -   GrabPay
    -   WeChat Pay
    -   AliPay
-   Combine multiple payment providers into a single QR code.
-   Simple API for easy integration.

## Dependencies

This library generates the payload string. To render it as a visual QR code, you need a QR code generation library. The included demo (`index.html`) uses **[qrcode.js](https://github.com/davidshimjs/qrcodejs)** loaded from cdnjs.

## Demo

The included `index.html` file serves as a complete working demo. It provides a user interface to input merchant details for various payment methods and generates a downloadable SGQR code.



## Installation

Download `generate-sgqr.js` and include it in your HTML file along with a QR code rendering library.

```html
<!-- This Library -->
<script src="generate-sgqr.js"></script>

<!-- QR Code Rendering Library (cdnjs) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

## Usage

1.  **Create an HTML container** for your QR code.

    ```html
    <div id="qrcode"></div>
    ```

2.  **Instantiate your QR code rendering library.**

    ```javascript
    // Using qrcode.js as an example
    var qrcodeDrawer = new QRCode(document.getElementById("qrcode"), {
        width: 256,
        height: 256,
        correctLevel: QRCode.CorrectLevel.H // High correction level is recommended
    });
    ```

3.  **Prepare the payment data.** The data must be in a specific array format. Each payment method is an object with an `id` and a `value` which is an array of its own key-value pairs.

    ```javascript
    // Example data for multiple payment methods
    const merchantName = "My Awesome Cafe";
    const paymentData = [];

    // --- PayNow ---
    // ID '26' for PayNow
    paymentData.push({
        id: '26',
        value: [
            { id: '00', value: 'SG.PAYNOW' },
            { id: '01', value: '2' }, // 2 = UEN
            { id: '02', value: '123456789A' }, // Your PayNow UEN
            { id: '03', value: '1' }, // 1 = Not editable amount
            { id: '05', value: 'REF1234' } // Optional payment reference
        ]
    });

    // --- GrabPay ---
    // ID '27' for GrabPay (increment from the last one)
    paymentData.push({
        id: '27',
        value: [
            { id: '00', value: 'COM.GRAB' },
            { id: '01', value: 'YOUR_GRABPAY_MERCHANT_ID' } // Your GrabPay Merchant ID
        ]
    });

    // --- WeChat Pay ---
    // ID '28' for WeChat Pay
    // The value for ID '05' MUST be Base64 encoded.
    const wechatUrl = "https://wx.tenpay.com/f2f?t=AAAAAAA";
    const wechatUrlBase64 = window.btoa(wechatUrl);
    paymentData.push({
        id: '28',
        value: [
            { id: '00', value: 'com.qq.weixin.pay' },
            { id: '05', value: wechatUrlBase64 } // Base64 encoded H5 QR URL
        ]
    });

    // --- AliPay ---
    // ID '29' for AliPay
    paymentData.push({
        id: '29',
        value: [
            { id: '00', value: 'com.alipay' },
            { id: '01', value: 'https://qr.alipay.com/ocx_YOUR_ID' } // Your AliPay Static QR URL
        ]
    });
    ```

4.  **Instantiate `generateSGQR` and get the payload string.**

    ```javascript
    const sgqr = new generateSGQR({
        merchant: merchantName,
        payinfo: paymentData
    });

    const payload = sgqr.output();
    ```

5.  **Render the QR code.**

    ```javascript
    // Use the payload to generate the QR code image
    qrcodeDrawer.makeCode(payload);
    ```

## API Reference

### `new generateSGQR(options)`

Creates a new SGQR instance.

-   `options` (Object): Configuration object.
    -   `merchant` (String, Optional): The name of the merchant to be displayed in payment apps.
    -   `payinfo` (Array, Required): An array of payment method objects. See the structure below.

### `.output()`

Returns the generated SGQR payload string. This string should be passed to your QR code rendering library.

---

### `payinfo` Data Structure Details

The `payinfo` array contains objects, each representing a payment method. The top-level `id` for each payment method should start from `'26'` and increment for each subsequent method.

#### PayNow (ID: `26`)

| Sub-ID | Description                       | Value Example       | Required? |
| :----- | :-------------------------------- | :------------------ | :-------- |
| `00`   | Application ID                    | `'SG.PAYNOW'`       | Yes       |
| `01`   | Proxy Type (`2`=UEN, `3`=Mobile)  | `'2'`               | Yes       |
| `02`   | Proxy Value (UEN or Mobile No.)   | `'123456789A'`      | Yes       |
| `03`   | Amount Editable (`0`=Yes, `1`=No) | `'1'`               | Yes       |
| `05`   | Payment Reference                 | `'Invoice-9876'`    | No        |

#### GrabPay (ID: `27+`)

| Sub-ID | Description    | Value Example            | Required? |
| :----- | :------------- | :----------------------- | :-------- |
| `00`   | Application ID | `'COM.GRAB'`             | Yes       |
| `01`   | Merchant ID    | `'YOUR_MERCHANT_ID'`     | Yes       |

#### WeChat Pay (ID: `28+`)

| Sub-ID | Description                   | Value Example                          | Required? |
| :----- | :---------------------------- | :------------------------------------- | :-------- |
| `00`   | Application ID                | `'com.qq.weixin.pay'`                  | Yes       |
| `05`   | H5 QR URL (**Base64 encoded**) | `window.btoa('https://wx.tenpay...')` | Yes       |

#### AliPay (ID: `29+`)

| Sub-ID | Description      | Value Example                          | Required? |
| :----- | :--------------- | :------------------------------------- | :-------- |
| `00`   | Application ID   | `'com.alipay'`                         | Yes       |
| `01`   | Static QR URL    | `'https://qr.alipay.com/ocx...'`       | Yes       |