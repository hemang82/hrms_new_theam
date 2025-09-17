import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PUBLIC_URL } from '../config/constant'
import { useDispatch, useSelector } from 'react-redux';
import { closeModel } from '../config/commonFunction';
import { ModelName } from '../config/commonVariable';

const Model = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const { customModel: { isOpen, modalType } } = useSelector((state) => state.masterslice);

    return (
        <div>
            <div
                className={`modal custom_model ${isOpen ? 'fade show d-flex align-items-center justify-content-center' : 'd-none'}`}
                id="delete-account"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <form>
                    <div className={ModelName.DELETE_MODEL === modalType || ModelName.LOGOUT_MODEL === modalType ? "modal-dialog modal-md modal-dialog-centered" : "modal-dialog modal-lg modal-dialog-centered"}>
                        <div className={ModelName.DELETE_MODEL === modalType || ModelName.LOGOUT_MODEL === modalType ? "modal-content modal-filled" : "modal-content"}>

                            {/* {
                                ModelName.DELETE_MODEL !== modalType && (<> */}
                            <div className="modal-header d-flex align-items-center">
                                <h4 className="modal-title" id="myLargeModalLabel">
                                    {/* Post Title */}
                                </h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => { closeModel(dispatch) }}
                                />
                            </div>
                            {/* </>)
                            } */}

                            <div className="modal-body">
                                {children}
                            </div>

                            {/* Uncomment this section if you want to use buttons */}
                            {/* 
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary modal-btn font_14"
                    onClick={() => navigate('/delete_account_verify')}
                  >
                    Continue
                  </button>
                  <button
                    className="btn text-darkgray font_14 font_500 mx-auto"
                    onClick={() => setModel(false)}
                  >
                    Cancel
                  </button>
                </div> 
                */}
                        </div>
                    </div>
                </form>
            </div>

            {isOpen && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Model
