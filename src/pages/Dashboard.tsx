import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

import './Dashboard.css';
import { DoggoBreedType, DoggoPayload } from './types';
import { titleCase } from '../util/textUtil';

const createBreedList = (data: DoggoBreedType) => {
  const allBreeds: string[] = [];

  // Create a list of strings
  // Handles singular breeds and breeds with sub-breeds
  Object.entries(data).forEach(([key, value], i) => {
    if (value.length !== 0) {
      value.forEach((subBreed: string) => {
        allBreeds.push(`${subBreed} ${key}`)
      });
    } else {
      allBreeds.push(key);
    }
  });

  return allBreeds;
}

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [breedList, setBreedList] = useState<Array<string>>([]);
  const [chosenDoggo, setChosenDoggo] = useState<DoggoPayload | null>(null);

  const DOGGO_BASE_URL = "https://dog.ceo/api/";

  useEffect(() => {
    axios.get(DOGGO_BASE_URL + "breeds/list/all").then((res) => {
      setBreedList(createBreedList(res.data.message));
    });
  }, []);

  const handleOnChange = (event: any) => {
    setLoading(true);

    let url = DOGGO_BASE_URL + "breed/"

    // If there is a sub-breed, we will get two strings, else we will only get the 1 breed
    const breed = event.target.value.split(" ").reverse();
    url = url.concat(breed.join('/'));
    url = url.concat("/images/random");

    axios.get(url)
      .then((res) => setChosenDoggo(res.data))
      .finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="d-flex p-4 flex-column align-items-center">
      <h1 className="font-weight-bold">
        Search a Doggo
      </h1>
      <div className='m-2' style={{ width:"50%" }}>
        <Form.Control as="select" size="lg" aria-label="Default select example" onChange={handleOnChange}>
          <option>Pick a breed!</option>

          {breedList &&
            breedList.map((breed: string, i: any) => {
              return (
                <option key={`${breed}-${i}`} value={breed}>{titleCase(breed)}</option>
              )
            })
          }
        </Form.Control>
      </div>

      {chosenDoggo &&
      <div className="d-flex flex-column align-items-center p-3">
        <Image src={chosenDoggo.message} roundedCircle={true} fluid={true}/>
        <h3 className="p-5">
          This is DOGGO
        </h3>
      </div>
      }
    </div>
  )
}

export default Dashboard;