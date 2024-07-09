import { Card, CardContent, CardHeader } from '@mui/material';


export const AnimeCard = (props: AnimeCardProps) => {
    return (
        <div>
            <Card className="bg-gray-800 text-white">
                <CardContent>
                    
                </CardContent>
            </Card>
        </div>
    )
}

interface AnimeCardProps {
    name: string
    romaji: string
    image: string
}