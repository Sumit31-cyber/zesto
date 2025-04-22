
export async function wait(durationInMills : number) : Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, durationInMills));
  }