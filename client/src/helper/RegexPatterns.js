class RegexPatterns {
    // For user:
    static username = /^[a-z0-9]{5,15}$/;
    static password = /.{5,}$/;
    static repassword = /.{5,}$/;
    static fullname = /^(?:(?:[^\d\s]+\s?)+){2,}$/u;
    static email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    static phoneNumber = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/;

    // For bill:
    static nameBill = /^(?:(?:[^\d\s]+\s?)+){5,}$/u;
    static supplierBill = /^(?:(?:[^\d\s]+\s?)+){5,}$/u;
    static discountBill = /^(?:100|\d{1,2})$/;
    static notes = /^(?:(?:[^\d\s]+\s?)+)*$/u;

    // For approve:
    static Heading = /^[A-Z0-9]{4,}$/;   
    static RegisCode = /^[A-Z0-9]+\.+[0-9]+$/;  // BUG 
    static NumberSeries = /^\d+$/; 
    static NumberLength = /^\d+$/; 
    static RegisCode = /^[A-Z0-9]{5,}$/;    
    static AmountRegis = /^\d+$/;    

    // For cataloging:
    static ISBN = /^(?:\d{10}|\d{13})$/;
    static DDC = /^\d+\.\d+$/;
    // static EncryptName = /^[A-Z0-9]$/;
    // static MainTitle = /^(?:(?:[^\d\s]+\s?)+){2,}$/u;
    // static Editors = /^(?:(?:[^\d\s]+\s?)+){2,}*$/u;
    // static Synopsis = /^(?:(?:[^\d\s]+\s?)+)*$/u;
    // static Topic = /^(?:(?:[^\d\s]+\s?)+)*$/u;
    // static Publisher = /^(?:(?:[^\d\s]+\s?)+){5,}$/u;
    // static PubPlace = /^(?:(?:[^\d\s]+\s?)+)*$/u;
    // static PubYear = /^\d+$/;
    // static QuantityCopies = /^\d+$/;
    // static Size = /^[a-z0-9]{5,15}$/;
    // static UnitPrice = /^\d+$/;
    // static NumPages = /^\d+$/;

}

export default RegexPatterns;