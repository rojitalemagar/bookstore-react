import React, { useEffect, useState } from 'react';
import BookCards from '../shared/BookCards';



const BestSeller = () => {
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
                    setBooks(data.slice(0, 8));
                } else {
                    throw new Error("Invalid data format");
                }
            })
            .catch(error => {
                console.error("Error fetching best seller books:", error);
                setError(error.message);
            });
    }, []);

    return (
        <>
            {error ? <p className='text-red-500'>Error: {error}</p> : <BookCards books={books} headline={"Best Seller Books"} />}
        </>
    );
};

export default BestSeller;