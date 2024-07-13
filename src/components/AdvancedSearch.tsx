import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank, MdOutlineIndeterminateCheckBox } from 'react-icons/md'
import { useState } from 'react'
import { TextField } from '@mui/material'

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
    <div className='backdrop-blur-lg border border-white mt-4 rounded-md flex'>
      <div className='container m-6 p-6 rounded-lg flex flex-col gap-4'>
        <h1 className='text-start ml-2 text-bold font-poppins text-2xl'>Search</h1>
        <hr className='my-2' />
        <TextField label='Search for anime' variant='outlined' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          InputProps={{
            style: { color: 'white' },
          }}
          style={{
            borderColor: 'white',
            color: 'white',
          }}
          classes={{
            root: 'text-field-root',
          }}
        />

        <h1 className='text-start ml-2 text-bold font-poppins text-2xl'>Genres</h1>
        <hr className='my-2' />
        <div className='grid grid-cols-9 gap-4 mb-4'>
          {props.genres.map((genre, index) =>
            <Bullet key={genre} text={genre} genreIndex={index} handleGenreSelection={props.handleGenreSelection} />
          )}
        </div>
        <div className='bg-transparent text-center bg-opacity-50 text-white border border-gray-700 rounded-lg p-2.5 font-anime cursor-pointer shadow-md hover:bg-info hover:scale-105 transform transition duration-150 ease-in-out'>
          <div onClick={() => { props.handleSearch(searchTerm) }} >
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span>Search</span>
            </div>
          </div>
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