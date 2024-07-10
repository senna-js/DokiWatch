import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank, MdOutlineIndeterminateCheckBox } from 'react-icons/md'
import { useState } from 'react'

const Bullet = (props: BulletProps) => {
    const [bulletType, setBulletType] = useState<BulletType>(BulletType.indeterminate)
    const handleClick = () => {
        if (bulletType === BulletType.enabled) {
            setBulletType(BulletType.disabled)
        } else if (bulletType === BulletType.disabled) {
            setBulletType(BulletType.indeterminate)
        } else {
            setBulletType(BulletType.enabled)
        }
    }



    return (
        <div onClick={handleClick} className='flex hover:cursor-pointer items-center gap-1'>
            {props.text}
            {bulletType === BulletType.enabled && <MdOutlineCheckBox />}
            {bulletType === BulletType.indeterminate && <MdOutlineCheckBoxOutlineBlank />}
            {bulletType === BulletType.disabled && <MdOutlineIndeterminateCheckBox />}
        </div>
    )
}

export const AdvancedSearch = (props: AdvancedSearchProps) => {
    return (
        <div className='backdrop-blur-lg flex'>
            <div className='container m-6 p-6 rounded-lg'>
                <div >
                    <h1 className='text-center text-bold font-poppins text-2xl'>Genres</h1>
                    <hr className='my-2' />
                    <div className='flex flex-wrap gap-4'>
                        {props.genres.map(genre => <Bullet key={genre} text={genre} />)}
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
}

type AdvancedSearchProps = {
    genres: string[]
}