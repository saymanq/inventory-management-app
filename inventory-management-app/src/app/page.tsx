'use client';

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {collection, doc, getDocs, query, setDoc, deleteDoc, getDoc} from 'firebase/firestore'
import { UserAuth } from '../context/AuthContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

interface InventoryItem {
  name: string;
  quantity: number;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [displayinventory, setDisplayInventory] = useState<InventoryItem[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [itemName, setItemName] = useState<string>('')
  const [loading, setLoading] = useState(true);
  const [searchtext, setSearchText] = useState('');
  const [guest, setGuest] = useState(false);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { user } = UserAuth()

  const updateInventory = async () => {
    if (!user) return;
    const snapshot = query(collection(firestore, user.uid));
    const docs = await getDocs(snapshot);
    const inventoryList: InventoryItem[] = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() } as InventoryItem)
    })
    console.log(inventoryList);
    setInventory(inventoryList);
    setDisplayInventory(inventoryList);
  }

  useEffect(() => {
    const search = async () => {
      const filteredList = inventory.filter(item => item.name.toLowerCase().includes(searchtext.toLowerCase()))
      setDisplayInventory(filteredList)
    };
    search()
    console.log('hello');
  }, [searchtext])

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setLoading(false);
    };
    if (!user) {
      setInventory([]);
      setDisplayInventory([]);
    }
    checkAuthentication();
    updateInventory()
    setGuest(false);
  }, [user])

  const guestAddItem = (item: string) => {
    const inventoryList: InventoryItem[] = [...inventory]
    const newItem = item.toUpperCase() 
    if (inventoryList.some(itemm => itemm.name === newItem)) {
      const foundItem: InventoryItem | undefined = inventoryList.find(itemm => itemm.name === newItem);
      foundItem!.quantity += 1;
    } else {
      inventoryList.push({name: newItem, quantity: 1 } as InventoryItem)
    }
    setInventory(inventoryList);
    setDisplayInventory(inventoryList);
  }

  const addItem = async (item: string) => {
    if (!guest) {
    const docRef = doc(firestore, user.uid, item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data() as { quantity: number };
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 }, { merge: true })
      }
      await updateInventory()
    } else {
      guestAddItem(item)
    }
  }

  const guestRemoveItem = (item: string) => {
    const inventoryList: InventoryItem[] = [...inventory]
    const newItem = item.toUpperCase() 
    if (inventoryList.some(itemm => itemm.name === newItem)) {
      const foundItem: InventoryItem | undefined = inventoryList.find(itemm => itemm.name === newItem);
      if (foundItem!.quantity === 1) {
        const updatedList = inventoryList.filter(foundItem => foundItem.name !== newItem);
        setInventory(updatedList);
        setDisplayInventory(updatedList);
      } else { 
        foundItem!.quantity -= 1;
        const updatedList = inventoryList
        setInventory(updatedList);
        console.log(updatedList);
        setDisplayInventory(updatedList);
      }
    }
    
  }
  
  const removeItem = async (item: string) => {
    if (!guest) {  
      const docRef = doc(firestore, user.uid, item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data() as { quantity: number };
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
        }
      }
      await updateInventory()
    } else {
      guestRemoveItem(item)
    }
  }


  const handleGuestAccess = () => {
    setGuest(true);
  }

  if (!user && !guest) {
    return <Box
    width="100%"
    height="100%"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    >
    <div className="bg-violet-600 text-white sm:w-[500px] w-[330px] h-[300px] flex justify-center items-center mt-[150px] flex-col rounded-2xl">
      <Typography className='sm:text-[20px] text-[15px]'>Please log in to view your inventory.</Typography>
      <Typography className='my-3 sm:text-[20px] text-[15px]'>OR</Typography>
      <a className="bg-violet-800 rounded-xl px-4 py-2 cursor-pointer hover:bg-violet-900" onClick={handleGuestAccess}>
        <Typography className='sm:text-[20px] text-[15px]'>Get Guest Access</Typography>
      </a>  
    </div>
  </Box>;
  }

  if (user || guest) {
  return (
  <Box
    width="100%"
    height="100%"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
  >
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Item
        </Typography>
        <Stack width="100%" direction={'row'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    
    <TextField
          id="filled-search"
          label="Search field"
          type="search"
          variant="filled"
          sx={{ backgroundColor: 'white', marginTop: '50px', border: '5px solid #6c28d9' }}
          onChange={(e) => setSearchText(e.target.value)}
          
    />
    <div className="w-[350px] sm:w-[900px]">
    <Box border={'3px solid #6c28d9'} marginTop={3} sx={{ backgroundColor: '#1c1917'}}>
      <Box
        height="60px"
        bgcolor={'#6c28d9'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h4'} color={'white'} textAlign={'center'}>
          Inventory Items
        </Typography>
      </Box>
      <Stack height="300px" spacing={1} overflow={'auto'}>
        <Box height='1px' />
        {displayinventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="60px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          >
            <Typography className='sm:text-[25px] text-[15px]' color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography className='sm:text-[25px] text-[15px]' color={'#333'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <div className=''>
            <Button variant="contained" sx={{ backgroundColor: '#6c28d9', borderRadius:'16px', '&:hover': {backgroundColor: '#5a21b6'} }} onClick={() => removeItem(name)}>
              Remove
            </Button>
            </div>
          </Box>
        ))}
      </Stack>
    </Box>
    </div>
    <Button variant="contained" sx={{ backgroundColor: '#6c28d9', marginTop: '5px', borderRadius:'16px', '&:hover': {backgroundColor: '#5a21b6'} }} onClick={handleOpen}>
      Add New Item
    </Button>
    
  </Box>
  )
}
}