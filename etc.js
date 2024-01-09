    // useEffect(() => {
    //     if (!msgErr && msgData?.length) {
    //         setMsg(msgData)
    //         msgData.forEach((ms) => {
    //             if (ms.receiver === user.userId && ms.seen == false) {
    //                 console.log(ms)
    //                 socket.emit('msgseen', { _id: ms._id, sender: ms.sender })
    //             }
    //         })
    //     }
    // }, [msgData]);

      // function msgSeen(id) {
    //     console.log(id)
    //     const updatedMessages = msg.map(item => {
    //         if (item._id == id) {
    //             console.log(item);
    //             return { ...item, seen: true };
    //         } else {
    //             return item;
    //         }
    //     });
    //     return updatedMessages
    // }
    // useEffect(() => {
    //     const messageSeen = async (id) => {
    //         const updatedMsg = await new Promise((res, rej) => {           
    //             res(msgSeen(id));
    //         });
    //         console.log('updated', updatedMsg)
    //         setMsg(updatedMsg)
    //     };
    //     socket.on('msgseenchange', messageSeen)
    //     return (() => {
    //         socket.off('msgseenchange', messageSeen)

    //     })
    // }, [socket,msgSeen])