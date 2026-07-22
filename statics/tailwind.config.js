tailwind.config = {
    theme: {
        extend: {
            screens: {
                '2k' : '2048px',
                '4xl': '1500px',
                '3xl': '1336px',
                '2xl': '1280px',
                xl: '1024px',
                lg: '992px',
                md: '768px',
                sm: '525px',
                DEFAULT: '1360px',
            },
            container: {
                screens: {
                    sm: "640px",
                    md: "768px",
                    lg: "1024px",
                    xl: "1280px",
                    "2xl": "1336px"
                },
                center: true,
                maxWidth: '1336px',
                padding: {
                    DEFAULT: '20px',
                    '4xl': '0px',
                    '3xl': '24px',
                    '2xl': '24px',
                    xl: '24px',
                    lg: '24px',
                    md: '24px',
                    sm: '20px',
                },
            },
        },
        colors: {
            white: '#FFF',
            black: '#000',
            'bg-gray': '#E6E6E6',
            stock: {
                system: {
                    red: "#FF453A",
                    orange: "#FF9F0A",
                    yellow: "#FFD60A",
                    green: "#30D158",
                    teal: "#64D2FF",
                    blue: "#0A84FF",
                    indigo: "#5E5CE6",
                    purple: "#BF5AF2",
                    pink: "#FF2D55",
                },
            },
            text: {
                button: '#023D28',
                content: '#292929',
                title: '#F60',
                logo: '#115231',
                tertiary: '#666',
                quaternary: '#D28D3E',
                d9: '#31333F',
                158: '#15852B',

            },
            color: {
                text: '#115231',
                'text-100': '#0A0A0A',
            },
            label: {
                tertiary: '#E9AE3D',
            },
            neutral: {
                40: '#605E5E',
            }
        }
    }
}