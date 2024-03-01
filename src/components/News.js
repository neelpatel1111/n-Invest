import { React, useEffect, useState } from 'react';
import axios from 'axios';
import news_alt_img from '../img/news_alt_img.jpg'

const News = () => {

  const [Loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const API_KEY = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${API_KEY}`

    const fetchData = async () => {
      try {

        const response = await axios.request(url);
        setNewsData(response.data.articles)
        setLoading(false)

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {Loading === true ? (<>
        <div className='text-center mt-5 m-auto'>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>) : (

        <>
          <div className='container-fluid'>
            <div className="card-columns row d-flex justify-content-center my-3">
              {newsData.map((item) => (
                <div class="card col-3 text-start p-0 m-3 shadow-sm">

                  <img
                    src={item.urlToImage?item.urlToImage:news_alt_img}
                    height="150"
                  />

                  <div className="card-body">

                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text text-secondary">{new Date(item.publishedAt.slice(0, 10)).toString().slice(4, 15)}</p>
                    <p className="card-text">
                      <a href={item.url} target='_blank'>Read more...</a>
                    </p>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default News

