import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function SimC() {
  const router = useRouter()

  const [simcText, setSimcText] = useState("")

  const { simc_file } = router.query

  const getSimc = async (file: string) => {
    console.log(file)
    const simc_page = await fetch(`/api/simc/${file}`)
    if (simc_page.ok) {
      const data = await simc_page.json()
      setSimcText(data.data)
    } else {
      setSimcText("<div>SimC not found</div>")
    }
  }

  useEffect(() => {
    if (simc_file) {
      getSimc(simc_file as string)
    }
  })

  return (
    <>
      <div className="w-full h-full absolute bg-zinc-900">
        <iframe srcDoc={simcText} className="w-full h-full bg-zinc-900" />
      </div>
    </>
  )
}

