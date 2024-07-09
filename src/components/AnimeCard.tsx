import { Card, CardContent, CardHeader, CardMedia } from '@mui/material';


export const AnimeCard = (props: AnimeCardProps) => {
    return (
        <div>
            <Card className="bg-gray-800 text-white">
                <CardContent>
                    <CardHeader title={props.name} subheader={props.romaji} />
                    <CardMedia
                        component="img"
                        height="140"
                        image={props.image}
                        alt={props.name}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

interface AnimeCardProps {
    name: string
    romaji: string
    image: string
    mediaID : string
}