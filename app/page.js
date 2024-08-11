"use client";

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, IconButton } from '@mui/material';
import { deleteDoc, getDoc, getDocs, collection, doc, query, setDoc } from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemCount, setItemCount] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize filtered inventory
  };

  const addItem = async (item, count) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + count });
    } else {
      await setDoc(docRef, { quantity: count });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(({ name }) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection="column" 
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: 'url(https://media.noria.com/sites/Uploads/2019/9/25/2e3f1101-1f92-42aa-9081-c957fbf7bbff_ArticleImages_RP31449_1234x694_07092019_extra_large.jpeg)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f0f0f0',
      }}
    > 
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white" 
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              label="Item Name"
            />
            <TextField
              variant="outlined"
              fullWidth
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value) || '')}
              label="Item Count"
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName, itemCount || 1);
                setItemName('');
                setItemCount('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ 
          bgcolor: '#1976d2', 
          '&:hover': { bgcolor: '#115293' } 
        }}
      >
        Add New Item
      </Button> 
      
      <TextField
        variant="outlined"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2,
          '& fieldset': {
            borderColor: 'gray', // Border color
          },
          '&:hover fieldset': {
           borderColor: 'blue', // Border color on hover
          },
          '&.Mui-focused fieldset': {
           borderColor: 'green', // Border color when focused
          },
          '& .MuiInputBase-input': {
          color: 'black', // Text color
          backgroundColor: 'white', // Background color of the input
          },
          '& .MuiInputBase-input::placeholder': {
          color: 'gray', // Placeholder color
          },
          '& .MuiInputLabel-root': {
          color: 'black', // Label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
          color: 'green', // Label color when focused
          },
        }}
      />

      <Box border={'1px solid #333'} borderRadius={2} bgcolor={'#fff'} boxShadow={3} p={2}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius={2}
        >
          <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
      
        <Stack width="800px" height="300px" spacing={2} overflow="auto" p={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box 
              key={name} 
              width="100%"
              minHeight="80px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f5f5f5"
              padding={2}
              borderRadius={1}
              boxShadow={1}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <IconButton 
                  color="error" 
                  onClick={() => removeItem(name)}
                  size="small"
                >
                  <DeleteIcon></DeleteIcon>
                </IconButton>
              </Box>
              <Typography variant="h6" color="#333">
                {quantity}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                onClick={() => addItem(name, 1)}
              >
                Add
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => addItem(name, -1)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
