// Filename - components/ReadMore.js

import { useState } from "react";

type ReadMoreProps = {
    children: string;
};

const ReadMore: React.FC<ReadMoreProps> = ({ children }) => {
    const text: string = children;
    if (!text) 
        return (<p className="text">Loading...</p>)

    if (text.length <= 100) {
        return <p className="text cursor-default">{text}</p>;
    }
    
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className="text cursor-default">
            {isReadMore ? text.slice(0, 100) : text}
            <span
                onClick={toggleReadMore}
                className="read-or-hide cursor-pointer"
                style={{ color: "green" }}
            >
                {isReadMore ? "...read more" : " show less"}
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