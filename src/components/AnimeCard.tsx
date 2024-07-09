import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import


export const AnimeCard = (props : AnimeCardProps) => {
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
    name : string
    romaji : string
    image : string
}