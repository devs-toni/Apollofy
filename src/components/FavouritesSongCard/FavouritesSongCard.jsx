import { FaHeart } from 'react-icons/fa'
import { SlOptions } from 'react-icons/sl'
import { GiMicrophone } from "react-icons/gi";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';





export const FavouritesSongCard = ({  track, count }) => {

  const { id, title, duration, rank, preview, artist_name, album_cover } = track;
  const { authState } = useAuth();
  const { removeFromFavourites } = useUser();
  
  const isLike = true;

  const removeLike = () => {
    axios.patch(import.meta.env.VITE_BACKEND + "tracks/like/" + id, {}, {
      headers: {
        "Authorization": authState.token
      }
    })
      .then(({ data }) => {
        removeFromFavourites(id);
      })
  }

  return (
    <div className='flex w-full items-center justify-center h-full'>
      <div className='w-full md:max-w-2xl lg:max-w-3xl min-w-[100%] pt-2'>
        <div className='flex items-center rounded-xl bg-box-icons h-16'>
          <span className='w-1/12 text-center'>{count + 1}</span>
          <div className=' flex w-2/12 items-center justify-center'>
            <img className="rounded-lg w-16 " src={album_cover} alt="image description" width="" height="" />
          </div>
          <span className="text-xs text-center w-2/12 md:text-md grow truncate">{title}</span>
          <div className={`${isLike ? "border-red-500" : "border-gray-400"} w-3/12 flex items-center justify-center text-xs md:text-2xl rounded-full my-auto cursor-pointer `}>
            <FaHeart className={`${isLike ? "text-red-400" : "text-gray-600"} mr-4`} onClick={removeLike} />
            <Link to="/">
              <GiMicrophone
                className={`${isLike ? "text-white-400" : "text-gray-600"
                  } mr-4`}
              />
            </Link>
            <SlOptions className="text-withe-600" />
          </div>
          <p className="text-xs text-center font-normal w-3/12 md:text-md truncate">{artist_name}</p>
          <span className="text-xs text-center w-2/12 md:text-md grow">Genero</span>
          <span className="text-xs text-center w-2/12 md:text-md grow">{(duration / 60).toFixed(2)} min</span>

        </div>
      </div>
    </div>
  )
}
