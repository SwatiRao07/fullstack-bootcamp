class City{
    public city1="mumbai"
    private city2="pune"

    reveal(){
    return this.city2
}

}

class Area{
    protected city3="Nagpur"
}

class Address extends Area{
    getName(){
        return this.city3
    }
}

const a= new Address()
console.log(a.getName())


const c=new City()
console.log(c.city1)
console.log(c.reveal())


class SecretBox {
  #secret: string;

  constructor(secret: string) {
    this.#secret = secret;
  }

  reveal() {
    return this.#secret;
  }
}

const box = new SecretBox("Hidden Message");
console.log(box.reveal()); 


// class Car{
//     make:string
//     model:string

//     constructor(make:string, model:"string"){
//     this.make=make
//     this.model=model

// }
// }

// const c=new Car("tata", "toyota")
// console.log(c)