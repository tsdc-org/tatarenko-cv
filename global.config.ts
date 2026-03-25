export default {
    globals: {
        themes: ['dark', 'light'],
        locales: ['ru', 'en'],
    },
    requests: {
        telegram: 240373182,
    },
    captcha: {
        key: '2eb435c8-d342-4ec2-bfc0-ed74765c8864' // change
    },
    theme: {
        background: {
            dark: '#1C1917',
            light: '#FFFFFF'
        },
        font: {
            dark: '#FFFFFF',
            light: '#000000'
        },
        border: {
            dark: '#44403B',
            light: '#D6D3D1'
        },
        accent: '#00D492'
    },
    cms: {
        project: 'oeazzb4g',
        api: '2026-02-27',
        dataset: 'production',
    },
    metrics: {
        yandex: 108240539,
        gtag: 'GTM-TFT8VB5P', // change
    },
    head: {
        url: 'https://cv.xlsft.ru', // change
        author: 'xlsft',
        address: {
            locality: 'Липецк',
            region: 'Липецкая область',
            postal: '398059',
            country: 'Россия',
        }
    },
    schema: {
        person: {
            fullname: 'Даниил Татаренко',
            firstname: 'Даниил',
            lastname: 'Татаренко',
            initials: 'Даниил Т.',
            position: 'Middle Backend Developer'
        },
        organization: {
            name: 'Татаренко Даниил',
            legalName: 'ИП Татаренко Даниил Сергеевич',
            legalAddress: '398059, Липецк гор., Неделина ул. Д 4, Корп А',
            inn: '482621861054',
            ogrn: '325480000060930',
            url: 'https://xlsft.ru', // change
            email: 'dev@xlsft.ru', // change
            logo: 'https://cdn.sanity.io/images/d5cxszmz/production/dd1cb4829f950c4e116d511ccf77af3b5c2ed26a-480x100.svg', // change
            phone: '+7 (900) 599-01-73'
        }
    }
}