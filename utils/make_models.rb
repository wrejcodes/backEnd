csv_folder = ARGV[0]

if csv_folder == nil
  puts 'Please give path to csv folder'
  exit 
end

Dir.glob("#{csv_folder}*.csv") do |file|
  `npm run parse #{file} SQL`
end

Dir.glob("#{csv_folder}*.sql") do |file|
  filename = File.basename(file, ".sql")
  model_name = filename.gsub(/_v\d*/, "")
  model_name = 'experiment' if model_name == 'assay'
  Dir.glob("migrations/*.js") do |mfile|
    if mfile =~ /#{model_name.gsub("_","-")}.js/
      `rm #{mfile}`
    end
  end
  Dir.glob("models/*.js") do |mfile|
    if mfile =~ /#{model_name}.js/
      `rm #{mfile}`
    end
  end
  `sequelize model:create --name #{model_name} --attributes $(cat #{file})`
end