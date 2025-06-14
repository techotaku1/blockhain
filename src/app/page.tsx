export default function Home() {
  const forumCategories = [
    {
      title: 'Ethereum Basics',
      description: 'Learn about ETH fundamentals, wallets, and transactions',
      topics: 156,
      posts: 1234,
    },
    {
      title: 'Smart Contracts',
      description: 'Discussion about smart contract development and security',
      topics: 89,
      posts: 567,
    },
    {
      title: 'DeFi Projects',
      description: 'Explore decentralized finance projects on Ethereum',
      topics: 203,
      posts: 1890,
    },
    {
      title: 'Gas & Mining',
      description: 'Everything about gas fees, mining, and staking',
      topics: 145,
      posts: 988,
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Ethereum Community Forum
      </h1>

      <div className="grid gap-6">
        {forumCategories.map((category, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-blue-600">
                  {category.title}
                </h2>
                <p className="mt-2 text-gray-600">{category.description}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{category.topics} topics</p>
                <p>{category.posts} posts</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
