import { NavLink } from "react-router-dom";
import { DETAILS } from "../../router/paths";

const Soundbox = ({ name, image, artist, section }) => {

  const search = section === "search" ? true : false;

  return (
    <NavLink to={`/${DETAILS}/album/1`}>
      <div
        className=
        {
          `
          bg-chart box-shadow mt-2 p-5 pb-10 text-left sm:mr-5 mb-4 rounded-md m-auto
          ${search && "min-w-full pb-5 sm:pb-14 flex flex-row sm:flex-col sound-box"}
          `
        }
      >

        <div
          className=
          {
            `
            flex flex-row justify-center text-center mb-3 h-4/5
            ${search && 'max-w-180 mr-5 sm:mr-0 sm:max-w-full sm:min-h-80 min-w-180 h-full md:w-full img-container'}
            `
          }
        >
          <img
            src={image}
            alt={name}
            className=
            {
              `
              rounded-lg w-full h-full max-h-270 object-cover
              ${search && 'min-h-80p max-h-80p sm:max-h-max max-w-xs'}
              `
            }
          />
        </div>

        <div className="mt-2 pl-1 data">
          <p className="font-medium text-md mb-2">{name}</p>
          <p className="text-sm">{artist}</p>
        </div>
      </div >
    </NavLink>
  )
}

export default Soundbox