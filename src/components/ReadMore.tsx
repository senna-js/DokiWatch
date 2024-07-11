// Filename - components/ReadMore.js

import { useState } from "react";


type ReadMoreProps = {
    children: string;
};

const ReadMore: React.FC<ReadMoreProps> = ({ children }) => {
    const text: string = children;
    const [isReadMore, setIsReadMore] = useState(true);
    if (!text)
        return (<p className="text">Loading...</p>)
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className="text cursor-default">
            {isReadMore ? text.slice(0, 500) : text}
                <span onClick={toggleReadMore} className="read-or-hide cursor-pointer inline-flex items-center justify-center text-black select-none" style={{ marginLeft: '8px', color: 'gray' }}>
                    {isReadMore ? (
                        <>
                            <span className="mr-1">+</span>
                            <span>Read More</span>
                        </>
                    ) : (
                        <>
                            <span className="mr-1">-</span>
                            <span>Show Less</span>
                        </>
                    )}
                </span>
        </p>
    );
};

type ContentProps = {
    text: string;
};

const Content = (props: ContentProps) => {
    return (
        <div className="container">
            {/* <h2> */}
            <ReadMore>
                {props.text}
            </ReadMore>
            {/* </h2> */}
        </div>
    );
};

export default Content;