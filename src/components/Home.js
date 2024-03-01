import { React, useEffect, useState } from 'react'
import BitcoinChart from './livecoinwatch/BitcoinChart'
import axios from 'axios';

const Home = () => {

  const [newsData, setNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const API_KEY = `4d985e46fa184cf7b228cced11bc954d`;
    const url = `https://newsapi.org/v2/everything?q=BSE&sortBy=publishedAt&apiKey=${API_KEY}`

    const fetchNewsData = async () => {
      try {

        const response = await axios.request(url);
        setNewsData(response.data.articles)
        setNewsLoading(false)
      } catch (error) {
        console.error(error);
      }
    }
    fetchNewsData();
  }, []);

  return (
    <>
      
      <div className="row m-4">

        <div className="col-8">

          {/* NEWS CAROUSEL */}
          {newsLoading === false ? (<>

            <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
              </div>
              <div class="carousel-inner">

                <div class="carousel-item active">
                  <img src={newsData[0].urlToImage} class="rounded d-block w-100" alt="..." style={{height:'60vh'}}/>
                  <div class="carousel-caption bg-light rounded p-1 mb-3 d-none d-md-block" style={{opacity: '0.7'}}>
                    <h5 className='text-dark'>
                      {newsData[0].title}                   
                    </h5>     
                    <a href={newsData[0].url} className='link' target='_blank'>Read More...</a>
                  </div>
                </div>

                {newsData.slice(1,5).map((item)=>(<>
                  <div class="carousel-item">
                    <img src={item.urlToImage} class="rounded d-block w-100" alt="..." style={{height:'60vh'}}/>
                    <div class="carousel-caption bg-light rounded p-1 mb-3 d-none d-md-block" style={{opacity: '0.7'}}>
                    <h5 className='text-dark'>
                      {item.title}                   
                    </h5>     
                    <a href={item.url} className='link' target='_blank'>Read More...</a>
                  </div>
                  </div>
                </>))}
                

              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>

          </>) : (<>
            <div className='text-center mt-5 m-auto'>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>)}

        </div>

        <div className="col-4">

          {/* Indices */}
          <iframe
            width="100%"
            height="250rem"
            src="https://liveindex.org/widget/300-light.php"
            frameborder="0"
            hspace="0"
            vspace="0"
            scrolling="0"
            style={{ background: 'transparent' }}
          />

          {/* Bitcoin */}
          <BitcoinChart />

          {/* Crypto currency rate */}
          <iframe
            src="https://in.widgets.investing.com/crypto-currency-rates?theme=lightTheme&hideTitle=false&roundedCorners=false&pairs=945629,997650,1001803,1010773,1010776"
            style={{ height: 52 + 'vh', width: 100 + '%' }}
            className='mt-1'
            frameborder="0"
            allowtransparency="true"
            marginwidth="0"
            marginheight="0">
          </iframe>

        </div>
      </div>


    </>

  )
}

export default Home
