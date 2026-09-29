export const errors = [
    // =========================
    // 通常のエラーページ
    // =========================

    // 4xx Client Error
    {
        category: "normal",
        code: "400",
        name: "Bad Request",
    },
    {
        category: "normal",
        code: "401",
        name: "Unauthorized",
    },
    {
        category: "normal",
        code: "402",
        name: "Payment Required",
    },
    {
        category: "normal",
        code: "403",
        name: "Forbidden",
    },
    {
        category: "normal",
        code: "404",
        name: "Not Found",
    },
    {
        category: "normal",
        code: "405",
        name: "Method Not Allowed",
    },
    {
        category: "normal",
        code: "406",
        name: "Not Acceptable",
    },
    {
        category: "normal",
        code: "407",
        name: "Proxy Authentication Required",
    },
    {
        category: "normal",
        code: "408",
        name: "Request Timeout",
    },
    {
        category: "normal",
        code: "409",
        name: "Conflict",
    },
    {
        category: "normal",
        code: "410",
        name: "Gone",
    },
    {
        category: "normal",
        code: "411",
        name: "Length Required",
    },
    {
        category: "normal",
        code: "412",
        name: "Precondition Failed",
    },
    {
        category: "normal",
        code: "413",
        name: "Content Too Large",
    },
    {
        category: "normal",
        code: "414",
        name: "URI Too Long",
    },
    {
        category: "normal",
        code: "415",
        name: "Unsupported Media Type",
    },
    {
        category: "normal",
        code: "416",
        name: "Range Not Satisfiable",
    },
    {
        category: "normal",
        code: "417",
        name: "Expectation Failed",
    },
    {
        category: "normal",
        code: "418",
        name: "I'm a teapot.",
    },
    {
        category: "normal",
        code: "421",
        name: "Misdirected Request",
    },
    {
        category: "normal",
        code: "422",
        name: "Unprocessable Content",
    },
    {
        category: "normal",
        code: "423",
        name: "Locked",
    },
    {
        category: "normal",
        code: "424",
        name: "Failed Dependency",
    },
    {
        category: "normal",
        code: "425",
        name: "Too Early",
    },
    {
        category: "normal",
        code: "426",
        name: "Upgrade Required",
    },
    {
        category: "normal",
        code: "428",
        name: "Precondition Required",
    },
    {
        category: "normal",
        code: "429",
        name: "Too Many Requests",
    },
    {
        category: "normal",
        code: "431",
        name: "Request Header Fields Too Large",
    },
    {
        category: "normal",
        code: "451",
        name: "Unavailable For Legal Reasons",
    },

    // 5xx Server Error
    // 5xx Server Error
    {
        category: "normal",
        code: "500",
        name: "Internal Server Error",
    },
    {
        category: "normal",
        code: "501",
        name: "Not Implemented",
    },
    {
        category: "normal",
        code: "502",
        name: "Bad Gateway",
    },
    {
        category: "normal",
        code: "503",
        name: "Service Unavailable",
    },
    {
        category: "normal",
        code: "504",
        name: "Gateway Timeout",
    },
    {
        category: "normal",
        code: "505",
        name: "HTTP Version Not Supported",
    },
    {
        category: "normal",
        code: "506",
        name: "Variant Also Negotiates",
    },
    {
        category: "normal",
        code: "507",
        name: "Insufficient Storage",
    },
    {
        category: "normal",
        code: "508",
        name: "Loop Detected",
    },
    {
        category: "normal",
        code: "510",
        name: "Not Extended",
    },
    {
        category: "normal",
        code: "511",
        name: "Network Authentication Required",
    },

    // =========================
    // Cloudflare 5xx
    // =========================

    {
        category: "normal",
        code: "520",
        name: "Web Server Returns an Unknown Error",
    },
    {
        category: "normal",
        code: "521",
        name: "Web Server Is Down",
    },
    {
        category: "normal",
        code: "522",
        name: "Connection Timed Out",
    },
    {
        category: "normal",
        code: "523",
        name: "Origin Is Unreachable",
    },
    {
        category: "normal",
        code: "524",
        name: "A Timeout Occurred",
    },
    {
        category: "normal",
        code: "525",
        name: "SSL Handshake Failed",
    },
    {
        category: "normal",
        code: "526",
        name: "Invalid SSL Certificate",
    },
    {
        category: "normal",
        code: "530",
        name: "Origin DNS Error",
    },

    // 独自エラー
    {
        category: "normal",
        code: "810",
        name: "Pillow Too Big",
    },
    {
        category: "normal",
        code: "925",
        name: "I'M BREAKING RULES!!!!",
    },


    // =========================
    // yt-dlp
    // =========================

    {
        category: "ytdlp",
        code: "400",
        name: "Bad Request",
    },
    {
        category: "ytdlp",
        code: "403",
        name: "Forbidden",
    },
    {
        category: "ytdlp",
        code: "404",
        name: "Not Found",
    },
    {
        category: "ytdlp",
        code: "429",
        name: "Too Many Requests",
    },
    {
        category: "ytdlp",
        code: "507",
        name: "Insufficient Storage",
    },
    {
        category: "ytdlp",
        code: "400_invalid_domain",
        name: "Invalid Domain / 無効なドメイン",
    },
    {
        category: "ytdlp",
        code: "500_download_error",
        name: "Download Error / ダウンロードエラー",
    },
    {
        category: "ytdlp",
        code: "500_unknown_action",
        name: "Unknown Action / 不明なアクション",
    },
    {
        category: "ytdlp",
        code: "502_access_error",
        name: "Access Error / アクセスエラー",
    },
];
