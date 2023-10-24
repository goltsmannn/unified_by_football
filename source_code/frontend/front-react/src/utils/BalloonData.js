function prepareBalloonData(plc_json){
    let pictures = [];
    let avg = 0.0, cnt = 0;

    plc_json.reviews.forEach(review=>{
        avg += review.rating;
        cnt += 1;
        review.pictures.forEach(picture=>{
            if(pictures.length < 3){
            pictures.push(picture);
            }
        });
    });
    const data = {
        pictures: pictures,
        rating: avg/cnt,
    }
    return data;
}

export default prepareBalloonData;