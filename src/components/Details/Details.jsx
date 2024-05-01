import { useParams } from 'react-router-dom'
import { FILTER_TYPES } from '../Search/filterTypes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArtistHeader, DetailsCard, BoxCard, Section } from '../index';
import { ArtistOptions } from '../index';
import { useLanguage } from '../../context/LanguageContext';
import { v4 as uuidv4 } from 'uuid';
import { BsClock } from 'react-icons/bs';
import { Grid } from 'react-loader-spinner';
import defaultImage from '../../assets/imgs/defaultImage.png'


export const Details = () => {

  const { type, id } = useParams();
  const { text } = useLanguage();
  const [data, setData] = useState({});
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlistImage, setPlaylistImage] = useState("")


  const getDetails = async () => {
    let finalData = [];
    switch (type.charAt(0).toUpperCase() + type.slice(1)) {
      case FILTER_TYPES.ALBUMS:
        let img;
        await axios.get(import.meta.env.VITE_BACKEND + "albums/" + id)
          .then(({ data }) => {
            img = data.cover
            setData({
              id: data.artist_id,
              album_name: data.title,
              total: data.nb_tracks,
              album_picture: data.cover,
              fans: data.fans,
              artist_picture: data.artist_picture,
              artist_name: data.artist_name,
              likes: data.likes
            });
          })

        await axios.get(import.meta.env.VITE_BACKEND + "albums/getAlbumSongs/" + id)
          .then(({ data }) => {
            data.map(track => {
              track.album_cover = img
            })
            setTracks(data);
          })
        break;

      case FILTER_TYPES.ARTISTS:
        await axios.get(import.meta.env.VITE_BACKEND + "artists/" + id)
          .then(({ data }) => {

            setData({
              id: data.Id,
              artist_name: data.name,
              total: data.nb_album,
              artist_picture: data.picture,
              fans: data.nb_fan
            });
          });
        await axios.get(import.meta.env.VITE_BACKEND + "tracks/top/" + id)
          .then(({ data }) => {
            setTracks(data);
          })
        await axios.get(import.meta.env.VITE_BACKEND + "albums/top/" + id)
          .then(({ data }) => {
            setAlbums(data);
          })

        break;


      case FILTER_TYPES.PLAYLISTS:
        await axios.get(import.meta.env.VITE_BACKEND + "playlists/" + id)
          .then(async ({ data }) => {
            const title_playlist = data.title
            const image = data.picture

            setPlaylistImage(image);

            setData({
              id: data.Id,
              artist_name: data.title,
              total: data.nb_tracks,
              artist_picture: data.picture ? data.picture : undefined,
              fans: data.fans,
              description: data.description
            });
            await Promise.all(data.tracklist.map(async (id) => {
              await axios.get(import.meta.env.VITE_BACKEND + "tracks/image/" + id)
                .then(({ data }) => {
                  if (playlistImage.length === 0) data?.album_cover ? setPlaylistImage(data.album_cover) : ""
                  const newData = {
                    ...data,
                    album_cover: data.album_cover,
                    title_playlist,
                  }
                  finalData.push(newData)
                })
            }))
            setTracks(finalData);
          })
        break;
      case FILTER_TYPES.TRACKS:
        break;
    }
  }
  useEffect(() => {
    getDetails();
  }, [id])

  return (
    <div className='flex w-full items-center justify-center pb-12'>
      <div className="w-full h-full p-6 md:ml-20 lg:ml-52 mt-14 md:mt-20">
        {
          Object.keys(data).length > 0

            ?
            FILTER_TYPES.ARTISTS === type.charAt(0).toUpperCase() + type.slice(1)
              ?
              (
                <>
                  <ArtistHeader 
                    artist_picture={data.artist_picture} 
                    artist_name={data.artist_name} 
                    fans={data.fans} 
                    isLike={true} 
                    type={type} 
                    tracks={tracks} 
                  />
                  <ArtistOptions />
                  <div>
                    <Section 
                      tracks={tracks} 
                      targetClass="artists-tracks" 
                    />
                  </div>
                  <div>
                    <div>
                      {
                        albums.length > 0 &&
                        <>
                          <h1 className='albums__title'>{text.filters.albums}</h1>
                          <div className='albums__section'>
                            {
                              albums.map(obj => {
                                return (
                                  <BoxCard
                                    key={uuidv4()}
                                    obj={obj}
                                    targetClass="albums"
                                    type={FILTER_TYPES.ALBUMS}
                                  />
                                )
                              })
                            }
                          </div>
                        </>
                      }
                    </div>
                  </div>
                </>
              )
              :
              FILTER_TYPES.ALBUMS === type.charAt(0).toUpperCase() + type.slice(1)
                ?
                (
                  <>
                    <div className='sm:w-full flex flex-col items-center justify-center mt-10 md:mt-12 overflow-hidden z-10'></div>
                    <div className='max-w-81rem mb-12'>
                      <ArtistHeader
                        artist_name={data.artist_name}
                        album_name={data.album_name}
                        artist_picture={data.artist_picture}
                        album_picture={data.album_picture}
                        total={data.total}
                        tracks={tracks}
                        fans={data.fans}
                        type={type}
                        isLike={true}
                        artist_id={data.id}
                      />
                    </div>
                    <div className="z-5 flex flex-col h-25 text-center justify-center w-8/6 min-w-[100%] ">
                      <div className='flex items-center justify-between border-b border-b-gray-300'>
                        <p className="hidden md:block w-1/12">#</p>
                        <p className="w-2/12">{text.album.track_name}</p>
                        <p className="w-2/12"></p>
                        <p className="w-2/12 md:w-3/12">{text.liked.options}</p>
                        <p className="hidden md:block md:w-3/12">{text.album.album_name}</p>
                        <p className="hidden lg:block lg:w-2/12">{text.album.record_company}</p>
                        <BsClock className='w-3/12 md:w-2/12' />
                      </div>
                    </div>

                    {
                      tracks.length > 0 && tracks.map((track, index) => {
                        return (
                          <DetailsCard
                            key={uuidv4()}
                            track={track}
                            count={index}
                            tracks={tracks}
                            album_name={data.album_name}
                          />
                        )
                      })
                    }
                  </>
                )
                :
                (
                  <>
                    <div className='mb-12'>
                      <ArtistHeader artist_picture={data.artist_picture ? data.artist_picture : playlistImage?.length > 0 ? playlistImage : defaultImage } artist_name={data.artist_name} description={data.description} type={type} fans={data.fans} isLike={true} tracks={tracks} />
                    </div>
                    <div className="z-5 flex flex-col h-25 text-center justify-center w-8/6 min-w-[100%] ">
                      <div className='flex items-center text-xs md:text-sm lg:text-lg justify-between border-b border-b-gray-300'>
                        <span className="hidden md:block w-1/12">#</span>
                        <span className="w-2/12">{text.album.track_name}</span>
                        <span className="w-2/12"></span>
                        <span className="w-1/12 md:w-3/12">{text.liked.options}</span>
                        <span className="hidden md:block w-3/12">{text.playlists.playlist}</span>
                        <span className="hidden lg:block w-2/12">{text.liked.gender}</span>
                        <BsClock className='w-3/12 md:w-2/12 ' />
                      </div>
                    </div>
                    {
                      tracks.length > 0 && tracks.map((track, index) => {
                        return (
                          <DetailsCard
                            key={uuidv4()}
                            track={track}
                            count={index}
                            playlist_id={data.id}
                            playlistName={data.artist_name}
                            tracks={tracks}
                            isPlaylist={true}
                            ownerImage={playlistImage?.length > 0 ? playlistImage : undefined}

                          />
                        )
                      })
                    }
                  </>
                )
            :
            <Grid
              height="80"
              width="80"
              color="#ef5567"
              ariaLabel="grid-loading"
              radius="12.5"
              visible={true}
            />
        }
      </div>
    </div>
  )
}