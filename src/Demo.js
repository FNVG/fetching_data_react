import {useEffect, useRef, useState} from "react"
const BASE_URL = "https://jsonplaceholder.typicode.com"
function Demo() {
    const [error,setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const abortControllerRef = useRef(null);
    useEffect(()=>{
        const fetchPosts = async () => {
            if(abortControllerRef.current === null) 
                abortControllerRef.current.abort()

            abortControllerRef.current = new AbortController();
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/posts?page=${page}`, {
                    signal: abortControllerRef.current?.signal,
                });
                const posts_json = await response.json();
                setPosts(posts_json);
            } catch (e) {
                if(e.name=="abortError") {
                    console.log("Abort");
                    return ;
                }
                setError(e);
            } finally {
                setIsLoading(false);
            }
        } 
        fetchPosts();
    }, [page]);
    
    console.log(error);
    if(error) {
        return (
            <div>
                <h1>Something went wrong.Please try again!</h1>
            </div>
        );
    }

    return (
    <div>
        <h1 className="mb-4 text-2xl">Data Fetching in React</h1>
        <button onClick={()=>setPage(page+1)}> Increase Page ({page})</button>
        {isLoading && 
            <div>
                <h1>Is Loading...</h1>
            </div>
        }
        {!isLoading &&    
        <ul>
            {posts.map((post) => {
                return <li key={post.id}>{post.title}</li>
             })}
        </ul>
        }
    </div>
  );
}

export default Demo;
