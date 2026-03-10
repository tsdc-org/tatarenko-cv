import { tws } from 'tailwind-to-style'
import locales from '~~/i18n/locales/index'

import MarkdownIt from 'markdown-it'
import MarkdownItMDCPlugin from 'markdown-it-mdc'

const md = new MarkdownIt().use(MarkdownItMDCPlugin)

export function tw(strings: TemplateStringsArray, ...values: any[]) {
    const str = strings.reduce((acc, s, i) => acc + s + (values[i] || ''), '')
    return tws(str)
}

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig().public.config
    const [ locale, theme ] = [
        getRouterParam(event, 'locale'), 
        getRouterParam(event, 'theme')
    ]
    if (!locale || !config.globals.locales.includes(locale)) return createError({ status: 400, message: 'Locale is undefined' })
    if (!theme || !config.globals.themes.includes(theme)) return createError({ status: 400, message: 'Theme is undefined' })

    const client = useSanity()
    const data = await client.fetch<Pick<IndexQuery & SeoQuery, 'summary' | 'skills' | 'experience' | 'seo'>>(groq`{
        "summary": *[_type == "summary"][0]{ 
            "title": title[$locale], 
            "description": description[$locale], 
            "content": content[$locale], 
            "image": image.asset->url,
            "status": status[$locale], 
        },
        "skills": array::unique(*[_type == "skill"] | order(type asc) { "type": type })[]{
            "type": type,
            "items": *[_type == "skill" && type == ^.type] | order(name asc){
                name,
                color,
                priority
            }
        },
        "experience": *[_type == "experience"]{
            id, link,
            "name": name[$locale],
            "logo": logo[$theme].asset->url,
            "about": about[$locale],
            "positions": positions[]{
                "name": name[$locale],
                "description": description[$locale],
                "skills": skills[]->{
                    name, type, color, priority
                } | order(priority desc),
                duration,
            } | order(duration.from desc),
            "footer": footer[$locale],
        } | order(positions[0].duration.from desc),
        "seo": *[_type == "summary"][0]{
            "title": title[$locale],
            "description": description[$locale]
        }, 
    }`, { locale, theme })

    const vars = {
        background: config.theme.background[theme as keyof typeof config.theme.background],
        borderColor: config.theme.border[theme as keyof typeof config.theme.border],
        color: config.theme.font[theme as keyof typeof config.theme.font],
        accent: config.theme.accent
    }

    const style = /*css*/`
        * {
            border-color: ${vars.borderColor};
            outline-color: ${vars.borderColor};
            color: ${vars.color}
        }

        #summary div[endpoint] {
            display: flex;
            opacity: 50%;
        }

        h1 {
            color: ${vars.accent}
        }
    `

    return useSatori(event, /*html*/`<style>${style}</style>
        <div style="${tw`flex flex-col w-full h-full relative`}">
            <div style="${tw`flex gap-8 p-8 w-full items-start justify-between`}">
                <div id="summary" style="${tw`gap-2 flex flex-col grow max-w-[60%]`}">
                    ${md.render(data.summary.content).replaceAll('response-block', 'div')}
                    <div style="${tw`flex flex-col gap-1`}">
                        ${Object.entries(Object.fromEntries(data.skills.map((group) => [
                            group.type, 
                            group.items.sort((a, b) => b.priority - a.priority)
                        ]))).sort(([, aItems], [, bItems]) => bItems.length - aItems.length).map(([label, items]) => /*html*/`
                            <div style="${tw`flex flex-wrap gap-2 items-center`}; order:-${items.map((v: any) => v.name).join('').length}">
                                <span style="${tw`text-xs opacity-50 w-full`}">${label}</span>
                                ${items.map(item => { 
                                    const color = item.color.match(/var\(--color-([a-z0-9-]+)\)/)?.[1]
                                    return /*html*/`
                                        <span style="${tw`font-bold flex items-center text-xs px-2 py-1 gap-1 rounded-md !bg-${color}/50 border !border-${color}`}">
                                            ${item.name}
                                        </span>
                                    `.trim()
                                }).join('\n')}
                            </div>
                        `).join('\n')}
                    </div>
                </div>
                <img src="${data.summary.image}" style="${tw`w-[30%] rounded-lg`}">
            </div>
            <div style="${tw`font-bold flex items-center text-nowrap px-3 py-2 text-base gap-2 rounded-lg text-[${vars.color}] bg-[${vars.accent}] w-fit absolute bottom-8 right-8`}">
                ${locales[locale as keyof typeof locales].labels.contact_me}
            </div>
        </div>
    `)
})