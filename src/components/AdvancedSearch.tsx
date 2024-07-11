import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank, MdOutlineIndeterminateCheckBox } from 'react-icons/md'
import { useState } from 'react'
import { Button, TextField } from '@mui/material'

const Bullet = (props: BulletProps) => {
    const [bulletType, setBulletType] = useState<BulletType>(BulletType.indeterminate)
    const handleClick = () => {
        if (bulletType === BulletType.enabled) {
            setBulletType(BulletType.disabled)
            props.handleGenreSelection(props.genreIndex, -1)
        } else if (bulletType === BulletType.disabled) {
            setBulletType(BulletType.indeterminate)
            props.handleGenreSelection(props.genreIndex, 0)
        } else {
            setBulletType(BulletType.enabled)
            props.handleGenreSelection(props.genreIndex, 1)
        }
    }



    return (
        <div onClick={handleClick} className='flex hover:cursor-pointer items-center gap-1'>
            <p className='select-none'>{props.text}</p>
            {bulletType === BulletType.enabled && <MdOutlineCheckBox />}
            {bulletType === BulletType.indeterminate && <MdOutlineCheckBoxOutlineBlank />}
            {bulletType === BulletType.disabled && <MdOutlineIndeterminateCheckBox />}
        </div>
    )
}

export const AdvancedSearch = (props: AdvancedSearchProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('')

    return (
        <div className='backdrop-blur-lg flex'>
            <div className='container m-6 p-6 rounded-lg flex flex-col gap-4'>
                <h1 className='text-center text-bold font-poppins text-2xl'>Search</h1>
                <hr className='my-2' />
                <TextField label='Search' variant='outlined' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} />

                <h1 className='text-center text-bold font-poppins text-2xl'>Genres</h1>
                <hr className='my-2' />
                <div className='flex flex-wrap gap-4'>
                    {props.genres.map((genre, index) =>
                        <Bullet key={genre} text={genre} genreIndex={index} handleGenreSelection={props.handleGenreSelection} />
                    )}
                </div>
                <div className='flex justify-center'>
                    <Button onClick={()=>{props.handleSearch(searchTerm)}} variant='contained'>Search</Button>
                </div>
            </div>
        </div>
    )
}

enum BulletType {
    enabled,
    disabled,
    indeterminate
}

type BulletProps = {
    text: string
    genreIndex: number
    handleGenreSelection: (index: number, set: number) => void
}

type AdvancedSearchProps = {
    genres: string[]
    handleGenreSelection: (index: number, set: number) => void
    handleSearch: (searchTerm: string) => void
}