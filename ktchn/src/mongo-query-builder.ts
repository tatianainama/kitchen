const or = (condition: string, query: any[], options?: string) => {
  return {
    '$or': query.map(x => {
      return {
        [condition]: {
          '$regex': x,
          '$options': options,
        }
      } 
    })
  }
}

export {
  or,
}