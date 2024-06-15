import withAuth from "../Utilities/withAuth";
import { Stack,Flex } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState,useEffect} from "react";
import userIcon from "../Icon/user2.svg";
import addIcon from "../Icon/add.svg";
import {
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { profileSet,profileGet } from "../Utilities/api";
export default function Profile(){
  var name1 = JSON.parse(sessionStorage.getItem("name"));
  var account1 = JSON.parse(sessionStorage.getItem("account"));
  const [imageurl, setImageURL] = useState("");
  const formik = useFormik({
      initialValues: {
        name:name1
      },
      onSubmit: (values) => {
        profileSet(account1,values.name,imageurl)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err);
        });
        // console.log(values.name)
      },
    });
    useEffect(() => {
      profileGet(account1).then((res) => {
        setImageURL(res.photo)
      })
      .catch((err) => {
        console.log(err);
      });
    },[])
  async function uploadAvatar(file){
      if(file){
        const base64 = await new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
        setImageURL(base64)
        // const formData = new FormData();
        // formData.append("file", file);
        // for (var pair of formData.entries()) {
        //   console.log(pair[0]+ ', ' + pair[1]); 
      }
      //console.log(file)
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = () => resolve(reader.result);
        // reader.onerror = error => reject(error);
        // console.log(reader)
        // console.log(url)
      }
    
    // convertBase64 = (file) => {
    //   return new Promise((resolve, reject) => {
    //     const fileReader = new FileReader();
    //     fileReader.readAsDataURL(file)
    //     fileReader.onload = () => {
    //       resolve(fileReader.result);
    //     }
    //     fileReader.onerror = (error) => {
    //       reject(error);
    //     }
    //   })
    // }
    return withAuth(
        <Stack h="calc(100vh - 113px)" w="100vw" bgColor="#EBEBE9"
        borderRadius="50px" m="15px" alignItems="center" justifyContent="center" position="relative">
          <form onSubmit={formik.handleSubmit}>
            <Button type="submit" variant="unstyled" background="none" position="absolute" top="30px" right="50px">
                confirm
            </Button>
            <Stack alignItems="center">
                <Stack mb="40px">
                  {imageurl?<img style={{width:"128px",height:"128px",borderRadius: "100px",objectFit:"cover"}}src={imageurl}></img>:<Avatar name={name1}  size='2xl'></Avatar>}
                  <Flex justifyContent="flex-end" mt="-40px" zIndex="1">
                    <Flex alignItems="center" w="34px">
                      <Image src={addIcon} />
                      <input accept="image/*" type="file" onChange={(e)=>uploadAvatar(e.target.files[0])} style={{margin:0,padding:0,position:"absolute",opacity:0}}/>
                    </Flex>
                  </Flex>
                </Stack>
                <CustomControll bgColor="black">
                    <Flex alignItems="center" h="100%">
                    <CustomLabel>
                        <Image src={userIcon} ml="10px" />
                        <Text color="white">Name</Text>
                    </CustomLabel>
                    <Input
                        w="190px"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        border="none"
                        color="white"
                        fontSize="18px"
                        fontWeight="bolder"
                        focusBorderColor="#000000"
                    />
                    </Flex>
                </CustomControll>
            </Stack>
            </form>
        </Stack>
    )
}
const CustomLabel = styled(FormLabel)`
  font-size: 18px;
  color: #132644;
  font-weight: bold;
  margin-right: 5px;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
`;
const CustomControll = styled(FormControl)`
  border-radius: 30px;
  height: 60px;
  width: 350px;
  margin-bottom: 20px;
`;