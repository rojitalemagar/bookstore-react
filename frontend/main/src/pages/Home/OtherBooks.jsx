import React, { useEffect, useState } from 'react';
import BookCards from '../shared/BookCards';



const OtherBooks = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/all-books")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setBooks(data.slice(5, 12));
                } else {
                    throw new Error("Invalid data format");
                }
            })
            .catch(error => {
                console.error("Error fetching other books:", error);
                setError(error.message);
            });
    }, []);

    return (
        <div className='mt-24'>
            {error ? <p className='text-red-500'>Error: {error}</p> : <BookCards books={books} headline={"Other Books"} />}
        </div>
    );
};

export default OtherBooks;
