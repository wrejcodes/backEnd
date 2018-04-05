csv_folder = ARGV[0]

if csv_folder == nil 
  puts "You must specify path to csvs"
  exit
end

`npm run generate:models #{csv_folder}`
`npm run recreate:dev_test`

Dir.glob("#{csv_folder}*.csv") do |file|
  filename = File.basename(file, ".csv")
  model_name = filename.gsub(/_v\d*/, "")
  model_name = 'experiment' if model_name == 'assay'
  next if model_name =~ /_id/
  `npm run generate:unit_test #{model_name}`
  `npm run generate:route #{model_name}`
end
