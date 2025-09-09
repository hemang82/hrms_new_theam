import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PUBLIC_URL } from '../../config/constant';
import { useDispatch, useSelector } from 'react-redux';
import { updateSlidebarToggle } from '../../Store/slices/MasterSlice';

export default function SubNavbar({ title, header, subHeader, subHeaderOnlyView }) {

    const { slidebarToggle } = useSelector((state) => state.masterslice);

    const location = useLocation();
    const dispatch = useDispatch();

    const path = location?.pathname
    let splitPath = path?.split('/')


    const btnClick = () => {
        console.log('button CLicked');
        console.log('slidebarToggle', slidebarToggle);
        const body = document.querySelector("body");
        if (body) {
            body.setAttribute("data-sidebartype", slidebarToggle ? "mini-sidebar" : "full");
        }
        const screenWidth = window.innerWidth;
        if (screenWidth <= 992) {
            const leftSideMenu = document.getElementById("left_side_menu_id");
            if (leftSideMenu) {
                leftSideMenu.style.display = slidebarToggle ? "none" : "block";
            }
        }
    };
    return (
        <>
            {/* <header className="app-header"> */}
            {/* <div className="card bg-light-info shadow-none position-relative overflow-hidden">
                <div className="card-body px-4 py-3">
                  
                    <div className="row align-items-center">
                        
                        <div className="col-12 col-md-9 mb-3 mb-md-0">
                           
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard" className="text-decoration-none">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to={`/${splitPath?.[1]}`} className="text-decoration-none">
                                            {header}
                                        </Link>
                                    </li>
                                    {subHeader && (
                                        <li className="breadcrumb-item">
                                            <Link to={path} className="text-decoration-none">{subHeader}</Link>
                                        </li>
                                    )}
                                    {subHeaderOnlyView && (
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {subHeaderOnlyView}
                                        </li>
                                    )}
                                </ol>
                            </nav>
                        </div>

                        <div className="col-12 col-md-3 d-flex justify-content-md-end justify-content-center">
                            <div className="text-center">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* </header> */}
            <div className="card bg-light-info shadow-none border-0 position-relative overflow-hidden make-header">
                <div className="card-body px-4 py-3">
                    <div className="row align-items-center">

                        {/* Left Section: Sidebar Toggle + Breadcrumb */}
                        <div className="col-12 col-md-9 d-flex align-items-center gap-3 mb-3 mb-md-0">

                            {/* Sidebar Toggle */}
                            <button
                                type="button"
                                className="btn btn-light d-flex align-items-center justify-content-center p-2 shadow-sm rounded-circle"
                                onClick={() => {
                                    dispatch(updateSlidebarToggle(!slidebarToggle));
                                    btnClick();
                                }}
                            >
                                <i className="ti ti-menu-2 fs-5"></i>
                            </button>

                            {/* Breadcrumb */}
                            <nav aria-label="breadcrumb" className="ms-2">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard" className="text-decoration-none">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to={`/${splitPath?.[1]}`} className="text-decoration-none">
                                            {header}
                                        </Link>
                                    </li>
                                    {subHeader && (
                                        <li className="breadcrumb-item">
                                            <Link to={path} className="text-decoration-none">{subHeader}</Link>
                                        </li>
                                    )}
                                    {subHeaderOnlyView && (
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {subHeaderOnlyView}
                                        </li>
                                    )}
                                </ol>
                            </nav>
                        </div>

                        {/* Right Section: Optional Image/Graphic */}
                        <div className="col-12 col-md-3 d-flex justify-content-md-end justify-content-center">
                            <div className="text-center">
                                {/* Uncomment when image needed */}
                                {/* 
          <img 
            src={PUBLIC_URL + "/dist/images/breadcrumb/ChatBc.png"} 
            alt="Breadcrumb Graphic" 
            className="img-fluid rounded" 
            style={{ maxHeight: '60px' }} 
          />
          */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

//  <div className="card bg-light-info shadow-none position-relative overflow-hidden">
//                 <div className="card-body px-4 py-3">
//                     <div className="row align-items-center">
//                         <div className="col-9">
//                             <h4 className="fw-semibold mb-8">{title}</h4>
//                             <nav aria-label="breadcrumb">
//                                 <ol className="breadcrumb">
//                                     <li className="breadcrumb-item"><Link className="" to={'/dashboard'}>Dashboard</Link></li>
//                                     <li className="breadcrumb-item" aria-current="page">
//                                         <Link to={`/${splitPath?.[1]}`} className="text-decoration-none">
//                                             {header}
//                                         </Link>
//                                     </li>
//                                     {subHeader ?
//                                         <li className="breadcrumb-item"><Link to={path} >{subHeader}</Link></li> : <></>
//                                     }
//                                     {subHeaderOnlyView ?
//                                         <li className="breadcrumb-item active"><a>{subHeaderOnlyView}</a></li> : <></>
//                                     }
//                                 </ol>
//                             </nav>
//                         </div>
//                         <div className="col-3">
//                             <div className="text-center mb-n5">
//                                 {/* <img src={PUBLIC_URL + "/dist/images/breadcrumb/ChatBc.png"} alt className="img-fluid mb-n4" /> */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>