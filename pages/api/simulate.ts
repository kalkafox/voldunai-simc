// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    data: string
    link: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // get the environment variable
    const {SIMC_SERVER} = process.env
    const options = {timeout: 1000000}
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), options.timeout)
    const resp = await fetch(`http://${SIMC_SERVER}:8000`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Sent-From-SimC": "true",
        },
        body: JSON.stringify(req.body),
        signal: controller.signal,
        ...options,
    })
    clearTimeout(id)
    if (resp.ok) {
        const data = await resp.json()
        res.status(200).json({ data: data.data, link: data.link })
    } else {
        res.status(resp.status).json({ data: "Error", link: "" })
    }
}
