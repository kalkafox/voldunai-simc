// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const query = req.query
    const realm = query.realm
    const name = query.name
    const url = `https://us.api.blizzard.com/profile/wow/character/${realm}/${name}?namespace=profile-us&locale=en_US&access_token=USJNHMuVxbK0awFL60GBiQp8FBQXxp5n2r`
    const response = await fetch(url)
    if (response.ok) {
        const data = await response.json()
        res.status(200).json(data)
    } else {
        res.status(response.status).json({ name: 'Error' })
    }
}
