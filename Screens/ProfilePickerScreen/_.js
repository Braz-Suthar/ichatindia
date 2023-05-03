export default function _(data){
    let newData = []
    let temp = []
    data.forEach((item, index) => {
        if(!temp.length) {
            temp = [...temp, item]
        } else{
            if(temp.length < 3){
                temp = [...temp, item]
            }
            if(temp.length === 3){
                const _ = [...temp]
                newData = [ ...newData, _ ]
                temp.length = 0
            }
        }
        if(index == data.length - 1){
            const _ = [...temp]
            newData = [ ...newData, _ ]
        }
    })
    return newData
}