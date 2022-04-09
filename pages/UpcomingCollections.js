import Header from "../components/Header";

const style = {
  text: `text-white`,
}

export default function UpcomingCollections() {
  return (
    <div>
        <Header />
          <p className={style.text}> 
            
            Upcomming Collections are comming soon... Login under create and launch your own collection :)
                        
          </p>
    </div>
  )
}