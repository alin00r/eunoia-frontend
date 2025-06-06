import styled from "styled-components";
import CoverPhotoSlider from "../CoverPhotoSlider";
import TitleDesc from "../TitleDesc";
import CustomizeDetails from "../CustomizeDetails";
import Button from "../Button";
import { useGetPackage } from "../../features/package/useGetPackage";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAddRequest } from "../../features/requests/useAddRequest";

function CustomizePackage() {
  const { packageId } = useParams();
  const { packageData, isLoading } = useGetPackage(packageId);
  const { register, handleSubmit } = useForm();
  const { addRequest } = useAddRequest();
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({ 1: 0 });
  useEffect(
    function () {
      if (!isLoading && packageData.price) {
        const optionsPrice = Object.values(selectedOptions).reduce(
          (val, acc) => (acc += val)
        );
        setTotalPrice(packageData.price + optionsPrice);
      }
    },
    [packageData, setTotalPrice, isLoading, selectedOptions]
  );

  const onSubmit = (formData) => {
    const optionIds = [];
    Object.keys(formData).forEach(
      (key) =>
        key.startsWith("customize-package") && optionIds.push(formData[key])
    );

    const finalData = {
      packageId: packageId,
      data: {
        bookingDate: formData.bookingDate,
        Notes: formData.Notes,
        optionIds: optionIds,
      },
    };
    addRequest(finalData);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <form className="content" onSubmit={handleSubmit(onSubmit)}>
            <CoverPhotoSlider
              businessName={packageData?.packageName}
              image={packageData?.packagePhoto}
            />
            <TitleDesc
              title={"Description"}
              description={packageData?.description}
            />

            {packageData?.customizePackage?.map((pack) => (
              <CustomizeDetails
                packId={pack._id}
                title={pack?.name}
                key={pack?._id}
                options={pack?.options}
                register={register}
                selectedOptions={selectedOptions}
                setSelectedOption={setSelectedOptions}
              />
            ))}
            <label htmlFor="dateInput" className="titles">
              Select a Date:
            </label>
            <input
              className="date"
              type="date"
              id="dateInput"
              {...register("bookingDate")}
            />

            <p className="titles">Add notes:</p>
            <textarea {...register("Notes")} />
            <hr className="hr" />

            <p className="total">
              Total:{" "}
              <span className="price">
                {totalPrice}
                EGP
              </span>
            </p>
            <div className="button">
              <Button size="medium" type="submit" className="button">
                Request Reservation
              </Button>
            </div>
          </form>
        </>
      )}
    </Wrapper>
  );
}

export default CustomizePackage;

const Wrapper = styled.div`
  background-color: #fef9f0;
  min-height: 100vh;
  padding-bottom: 3rem;
  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 4rem;
  }
  .titles {
    color: #00000099;
    font-size: 1.4rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  .date {
    width: 30%;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.656);
    border-color: rgba(0, 0, 0, 0.2);
    padding: 7px;
    font-size: 16px;
    text-transform: uppercase;
  }
  ::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
  textarea {
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.656);
    resize: none;
    font-size: 16px;
    width: 50%;
    height: 7rem;
    padding: 5px;
  }
  textarea:focus {
    outline: none;
  }

  .total {
    margin-bottom: 15px;
    font-size: 1.6rem;
    color: #00000099;
    font-weight: 600;
    text-align: center;
  }
  .price {
    font-size: 1.3rem;
    font-weight: 400;
  }
  .button {
    text-align: center;
    font-size: 20px;
  }
  .hr {
    width: 70%;
    border-color: rgba(0, 0, 0, 0.086);
    margin: 2rem auto;
  }
  @media only screen and (max-width: ${({ theme }) => theme.mid}) {
    .total {
      margin-bottom: 10px;
      font-size: 1.4rem;
    }
    .price {
      font-size: 1.3rem;
    }
  }
  @media only screen and (max-width: ${({ theme }) => theme.small}) {
    .total {
      margin-bottom: 8px;
      font-size: 1.3rem;
    }
    .price {
      font-size: 1.2rem;
    }
  }
  @media only screen and (max-width: 52.5em) {
    .total {
      margin-bottom: 0px;
      font-size: 1.2rem;
    }
    .price {
      font-size: 1.1rem;
    }
  }
  @media only screen and (max-width: ${({ theme }) => theme.mobile}) {
    .content {
      gap: 0px;
      padding: 0 0.8rem;
    }
    .total {
      margin-bottom: 10px;
    }
    .button {
      width: 100%;
    }
    .titles {
      font-size: 1.2rem;
      margin: 10px 0;
    }
    textarea {
      width: 100%;
      height: 5rem;
      margin-bottom: 20px;
    }
    .date {
      width: 50%;
    }
  }
`;
