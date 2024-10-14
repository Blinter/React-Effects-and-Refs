// useInterval.js
import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        let id;
        if (delay !== null) {
            id = setInterval(() => {
                savedCallback.current();
            }, delay);
        }
        return () => {
            if (id) {
                clearInterval(id);
            }
        };
    }, [delay]);
}

export default useInterval;