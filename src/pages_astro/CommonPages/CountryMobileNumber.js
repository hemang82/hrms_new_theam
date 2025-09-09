import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Translate } from '../../config/common';
import { Controller, useForm } from 'react-hook-form';
import { getCountryListApiCall } from '../../Store/slices/MasterSlice';
import { handelInputText, isValidInput } from '../../config/commonFunction';
import { InputTypesEnum } from '../../config/commonVariable';

const CountryMobileNumber = ({ onChangeMobileNumber, onChangeCountryCode, setDefaultData, className, imageIcon }) => {
    const dispatch = useDispatch()

    const { control } = useForm();

    const { countryListData: { data: countryListData }, } = useSelector((state) => state.countryList);
    const [filteredCountries, setFilteredCountries] = useState(countryListData);
    const [inputValue, setInputValue] = useState(setDefaultData != undefined && setDefaultData != '' ? setDefaultData?.mobile_number : '');
    const [selectedCountry, setSelectedCountry] = useState({
        id: 101,
        country_en: "India",
        image: "https://eveksia.s3.me-central-1.amazonaws.com/flag/india.png",
        short_name: "IN",
        country_code: "+91"
    });

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        onChangeCountryCode(selectedCountry)
        // dispatch(getCountryListThunk())
    }, [])

    useEffect(() => {
        if (setDefaultData != undefined && setDefaultData != "") {

            const filtered = countryListData.filter(country =>
                country?.country_code.toLowerCase().includes(setDefaultData?.country_code)
            );
            setSelectedCountry(filtered[0]);
        }
    }, [countryListData])

    useEffect(() => {
        setFilteredCountries(countryListData)
    }, [countryListData])

    const handleSearchChange = (event) => {

        const value = event.target.value.toLowerCase()
        setSearchTerm(value);

        const filtered = countryListData?.filter(country =>
            country?.name.toLowerCase().includes(value)
            || country?.country_code.toLowerCase().includes(value)
        );
        setFilteredCountries(filtered);
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setFilteredCountries(countryListData)
        setSearchTerm('');
        // setCountryCode(country)
        onChangeCountryCode(country)
    };
    const handleMobileChange = (event) => {
        const { value, name } = event.target;
        isValidInput(name, value, event)
        // const inputValue = event.target.value;
        const formatted = value;
        onChangeMobileNumber(formatted)
        setInputValue(formatted);
    };

    const HandleMobileInput = (e) => {
        let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        inputValue = inputValue.slice(0, 11); // Limit to 11 characters
        e.target.value = inputValue;
    };
    return (
        <>
            <div className='d-flex'>
                <div class="btn-group me-2">
                    <button
                        type="button"
                        class="btn btn-light border border-2 dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{ backgroundColor: 'transparent' }}
                    >
                        {(selectedCountry || countryListData) ? (
                            <>
                                <img src={selectedCountry?.image || ''} className="flag-icon me-1 " style={{ borderRadius: '30px' }} />
                                <span className='me-1'>{selectedCountry?.country_code}</span>
                            </>
                        ) : (
                            <span>Select</span>
                        )}
                    </button>

                    <ul className="dropdown-menu w-100 slideInUp m-1" aria-labelledby="dropdownMenuLink" style={{ maxHeight: '200px', maxWidth: '200px', overflowY: 'auto', overflowX: 'auto', borderRadius: '10px' }} >
                        <li>
                            <input type="text" className="form-control p-1" placeholder="Search country" value={searchTerm} onChange={handleSearchChange} />
                        </li>
                        {filteredCountries?.map(country => (
                            <li key={country.id}>
                                <a className="dropdown-item w-100" href="#" onClick={() => handleCountrySelect(country)}>
                                    <img src={country.image} className="flag-icon pe-1" alt={`${country.country_en}`} />
                                    {country.country_code}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="input-group border rounded-1">
                    {
                        imageIcon ? (<>
                            <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1"><i className="ti ti-phone fs-6" /></span>
                        </>) : (<>
                        </>)
                    }

                    <input type="text" value={inputValue} className={`form-control  ${imageIcon ? 'border-0' : ''} ps-2 `} placeholder={'Enter mobile number'}
                        onChange={handleMobileChange} onKeyPress={HandleMobileInput} name={InputTypesEnum.MOBILE} />
                </div>
            </div>

        </>
    )
}

export default CountryMobileNumber
