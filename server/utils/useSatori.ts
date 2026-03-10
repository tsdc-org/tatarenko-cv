import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { html } from "satori-html"
import { useSatoriFont } from './useSatoriFont'
import type { H3Event } from "h3"

export const useSatori = async (event: H3Event, string: string) => {
    const query = getQuery(event)
    const width = Math.min(parseInt(String(query.width) || "2000"), 5000)
    const url = getRequestURL(event)
    
    const format = (url.pathname.split('.')?.[1] || 'png') as 'svg' | 'png'
    if (!['png', 'svg'].includes(format)) throw createError({ status: 404 })

    const fonts = [
        await useSatoriFont('Nunito', 400),
        await useSatoriFont('Nunito', 700)
    ]
    const svg = await satori(html(`${string.trim()}`.replace(/<\/?strong>/g, '')) as any, { width: 1200, fonts })
    if (format == 'svg') {
        setHeader(event, 'Content-Type', 'image/svg+xml')
        return svg
    }
    const png = new Resvg(svg, { background: 'rgba(0, 0, 0, 0)', fitTo: { mode: 'width', value: width }, font: { fontFiles: fonts.map(v => v.file), loadSystemFonts: false }}).render().asPng()
    if (format == 'png') {
        setHeader(event, 'Content-Type', 'image/png')   
    }

    return png
}