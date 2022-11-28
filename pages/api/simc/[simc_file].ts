// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    data: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // get simc_file from the url
    const {SIMC_SERVER} = process.env
    const {simc_file} = req.query
    // get the simc_file from the simc folder
    // assert that simc_file is a string
    const resp = await fetch(`http://${SIMC_SERVER}:8000`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "SimC-Profile": simc_file as string,
        },
    })
    if (resp.ok) {
        const data = await resp.json()
        res.status(200).json({ data: data.data })
        console.log(data)
    } else {
        res.status(resp.status).json({ data: "Error" })
    }
}
