// function wrapPromise<T>(promise: Promise<T>) {
//     let status = 'pending'
//     let response: T
//
//     const suspender = promise.then(
//         (res) => {
//             status = 'success'
//             response = res
//         },
//         (err) => {
//             status = 'error'
//             response = err
//         },
//     )
//     const read = () => {
//         switch (status) {
//             case 'pending':
//                 throw suspender
//             case 'error':
//                 throw response
//             default:
//                 return response
//         }
//     }
//
//     return {read}
// }
//
// export default wrapPromise
// VERY BASIC IMPLEMENTATION OF A FETCHING LIBRARY BASED ON SUSPENSE

// This is the official basic promiseWrapper they implement in React Suspense Demo:

import {useEffect, useState} from "react";

type Resource = { read: () => string | undefined };
function wrapPromise(promise: Promise<string>): Resource {
    let status = 'pending';
    let result: string;
    let suspender = promise.then(
        (r) => {
            status = 'success';
            result = r;
        },
        (e: any) => {
            status = 'error';
            result = e;
        }
    );
    return {
        read() {
            if (status === 'pending') {
                throw suspender;
            } else if (status === 'error') {
                throw result;
            } else if (status === 'success') {
                return result;
            }
        },
    };
}

/* Basic fetching function */

const fetcher = async (url: string): Promise<string> => {
    try {
        const res = await fetch(url);
        const data = await res.text();
        return data;
    } catch (e) {
        throw e;
    }
};

/* Util to delay loading */

// const delay = (d) => new Promise((r) => setTimeout(r, d));


/* HOOK that lets to start the fetch promise only on component mount */
/* It's based on "wrapPromise" utility, which is MANDATORY to return a Suspense consumable entity */

const useGetData: (url: string) => string | undefined = (url: string) => {
    const [resource, setResource] = useState<Resource | null>(null);
    useEffect(() => {
        const _resource = wrapPromise(fetcher(url));
        setResource(_resource);
    }, []);

    return resource?.read();
};

export default useGetData