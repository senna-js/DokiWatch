import { useParams } from "react-router-dom"
import axios from "axios"
import { useEffect } from "react"

export const Anime = () => {
    let params = useParams()
    const url = "https://consumnetapieshan.vercel.app/anime/gogoanime/demon?page=1";

    useEffect(() => {
        axios.get(url,{params: {page : 1}})
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [url])

    return (
        <div>Anime : {params.id}</div>
    )
}
